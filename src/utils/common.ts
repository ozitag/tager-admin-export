export function replaceFileExtension(
  fileName: string,
  newExtension: string
): string {
  const dotIndex = fileName.lastIndexOf('.');
  const fileNameWithoutExtension = fileName.slice(0, dotIndex);

  if (newExtension) {
    return `${fileNameWithoutExtension}.${newExtension}`;
  }

  return fileNameWithoutExtension;
}
