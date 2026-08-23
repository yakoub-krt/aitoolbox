export async function copyPromptText(text: string, writer: (value: string) => Promise<void>) {
  await writer(text);
}
