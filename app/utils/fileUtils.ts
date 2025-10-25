export const convertFilesToBase64 = (files: File[]): Promise<string[]> => {
  return Promise.all(
    files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
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

  try {
    const base64Files = await convertFilesToBase64(files);
    return base64Files;
  } catch (error) {
    throw new Error('Failed to convert images');
  }
};