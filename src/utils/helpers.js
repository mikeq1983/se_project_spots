export function setButtonText(
  submitBtn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
if (isLoading) {
  submitBtn.textContent = loadingText;
  console.log(`setting text to $(loading text)`);
} else {
  submitBtn.textContent = defaultText;
}
}