export const convertFilesToBase64 = (files: File[]): Promise<string[]> => {
  return Promise.all(
    files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Remove the data:image/jpeg;base64, prefix if it exists
          const base64String = result.split(',')[1] || result;
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })
  );
};

export const formatImageForAPI = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  console.log('🖼️ Converting files to base64:', files.length, 'files');

  try {
    const base64Files = await convertFilesToBase64(files);
    console.log('✅ Files converted successfully:', base64Files.length, 'files');
    return base64Files;
  } catch (error) {
    console.error('❌ Error converting files:', error);
    throw new Error('Failed to convert images');
  }
};