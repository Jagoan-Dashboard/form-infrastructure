// import * as React from "react";
// import { Icon } from "@iconify/react";
import { cn } from "~/lib/utils";
// import { speechToText } from "~/lib/speech-to-text";

// interface InputWithMicProps extends React.ComponentProps<"input"> {
//   enableVoice?: boolean;
// }

// Speech-to-text functionality temporarily disabled
// This component now renders a regular input without voice recording
function InputWithMic({
  className,
  type,
  // enableVoice = true,
  ...props
}: React.ComponentProps<"input">) {
  // const [isListening, setIsListening] = React.useState(false);
  // const [isMicAvailable, setIsMicAvailable] = React.useState(true);
  // const inputRef = React.useRef<HTMLInputElement>(null);

  // React.useEffect(() => {
  //   if (enableVoice) {
  //     speechToText.checkMicrophoneAccess().then(setIsMicAvailable);

  //     // Subscribe to state changes
  //     const unsubscribe = speechToText.onStateChange((listening, activeInput) => {
  //       // Only set listening state if this input is the active one
  //       setIsListening(listening && activeInput === inputRef.current);
  //     });
  //     return () => {
  //       unsubscribe();
  //     };
  //   }
  // }, [enableVoice]);

  // const handleMicClick = () => {
  //   if (!inputRef.current || !isMicAvailable) return;

  //   if (isListening) {
  //     speechToText.stopListening();
  //   } else {
  //     speechToText.startListening(inputRef.current);
  //   }
  // };

  // Regular input without voice functionality
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );

  // if (!enableVoice) {
  //   return (
  //     <input
  //       type={type}
  //       data-slot="input"
  //       className={cn(
  //         "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  //         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  //         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  //         className
  //       )}
  //       {...props}
  //     />
  //   );
  // }

  // // Sync ref value with controlled value
  // React.useEffect(() => {
  //   if (inputRef.current && props.value !== undefined) {
  //     inputRef.current.value = String(props.value);
  //   }
  // }, [props.value]);

  // return (
  //   <div className="relative w-full">
  //     <input
  //       ref={inputRef}
  //       type={type}
  //       data-slot="input"
  //       className={cn(
  //         "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  //         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  //         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  //         "pr-10",
  //         className
  //       )}
  //       {...props}
  //     />
  //     <button
  //       type="button"
  //       onClick={handleMicClick}
  //       className={cn(
  //         "absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition-colors",
  //         "focus:outline-none",
  //         isListening
  //           ? "text-blue-600 animate-pulse"
  //           : "text-gray-400 hover:text-blue-600",
  //         !isMicAvailable && "text-muted-foreground/50 cursor-not-allowed hover:text-muted-foreground/50"
  //       )}
  //       disabled={!isMicAvailable}
  //       title={
  //         isMicAvailable
  //           ? isListening
  //             ? "Klik untuk berhenti merekam"
  //             : "Klik untuk mulai perekaman suara"
  //           : "Mikrofon tidak tersedia"
  //       }
  //   >
  //       <Icon
  //         icon={isListening ? "mdi:microphone" : "mdi:microphone-outline"}
  //         className="w-5 h-5"
  //       />
  //     </button>
  //   </div>
  // );
}

export { InputWithMic };