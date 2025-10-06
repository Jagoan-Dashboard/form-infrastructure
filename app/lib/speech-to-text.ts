import axios from 'axios';

type StateChangeCallback = (isListening: boolean, activeInput: HTMLInputElement | HTMLTextAreaElement | null) => void;

export class SpeechToText {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isListening = false;
  private currentInput: HTMLInputElement | HTMLTextAreaElement | null = null;
  private currentStream: MediaStream | null = null;
  private apiEndpoint = import.meta.env.VITE_API_SPEECH_TO_TEXT || 'https://bravi.ub.ac.id/api/stt/transcribe';
  private stateChangeCallbacks: Set<StateChangeCallback> = new Set();

  // Subscribe to state changes
  onStateChange(callback: StateChangeCallback) {
    this.stateChangeCallbacks.add(callback);
    return () => this.stateChangeCallbacks.delete(callback);
  }

  private notifyStateChange() {
    this.stateChangeCallbacks.forEach(callback => callback(this.isListening, this.currentInput));
  }

  getCurrentInput(): HTMLInputElement | HTMLTextAreaElement | null {
    return this.currentInput;
  }

  async checkMicrophoneAccess(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone access denied:', error);
      return false;
    }
  }

  async startListening(input: HTMLInputElement | HTMLTextAreaElement) {
    if (this.isListening) {
      this.stopListening();
      return;
    }

    try {
      // Check browser compatibility
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.showError('❌ Browser Anda tidak mendukung fitur perekaman audio. Silakan gunakan browser yang lebih baru.');
        return;
      }

      if (!window.MediaRecorder) {
        this.showError('❌ Browser Anda tidak mendukung MediaRecorder. Silakan gunakan Chrome, Firefox, atau Safari terbaru.');
        return;
      }

      // Get microphone access with better audio quality
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.currentStream = stream;
      this.currentInput = input;
      this.audioChunks = [];
      this.isListening = true;
      this.notifyStateChange();

      // Try different audio formats for better compatibility
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else {
          mimeType = ''; // Let browser choose
        }
      }

      // Create MediaRecorder
      this.mediaRecorder = mimeType ?
        new MediaRecorder(stream, { mimeType: mimeType }) :
        new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        await this.transcribeAudio(audioBlob);

        // Stop all tracks
        if (this.currentStream) {
          this.currentStream.getTracks().forEach(track => track.stop());
          this.currentStream = null;
        }
        this.isListening = false;
        this.notifyStateChange();
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
      this.isListening = false;
      this.notifyStateChange();
      this.showError('Gagal memulai perekaman. Pastikan mikrofon diizinkan.');
    }
  }

  stopListening() {
    if (this.mediaRecorder && this.isListening) {
      try {
        this.mediaRecorder.stop();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
    this.isListening = false;
    this.notifyStateChange();
  }

  private async transcribeAudio(audioBlob: Blob) {
    if (!this.currentInput) return;

    const originalPlaceholder = this.currentInput.placeholder;
    this.currentInput.placeholder = 'Memproses suara...';
    this.currentInput.disabled = true;

    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.webm');
      formData.append('language', 'id');
      formData.append('task', 'transcribe');
      formData.append('return_timestamps', 'false');

      const response = await axios.post(this.apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const transcript = response.data.text || '';

      if (this.currentInput && transcript) {
        // Set the value using React's native setter to properly trigger onChange
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;

        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(this.currentInput, transcript);
        } else {
          this.currentInput.value = transcript;
        }

        // Trigger both input and change events for React
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        this.currentInput.dispatchEvent(inputEvent);
        this.currentInput.dispatchEvent(changeEvent);

      } else {
        throw new Error('Tidak ada teks yang dikenali');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      this.showError('❌ Gagal mengkonversi suara ke teks. Silakan coba lagi.');

      // Show error feedback
      if (this.currentInput) {
        this.currentInput.style.borderColor = '#f44336';
        setTimeout(() => {
          if (this.currentInput) {
            this.currentInput.style.borderColor = '';
          }
        }, 2000);
      }
    } finally {
      if (this.currentInput) {
        this.currentInput.placeholder = originalPlaceholder;
        this.currentInput.disabled = false;
      }
      this.currentInput = null;
    }
  }

  private showError(message: string) {
    alert(message);
  }

  getListeningState(): boolean {
    return this.isListening;
  }
}

// Singleton instance
export const speechToText = new SpeechToText();