export function renderLoading(
  submitBtn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    submitBtn.textContent = loadingText;
  } else {
    submitBtn.textContent = defaultText;
  }
}

export function handleSubmit(
  request,
  evt,
  loadingText = "Saving...",
  resetForm = true
) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const defaultText = submitButton.textContent;
  renderLoading(submitButton, true, defaultText, loadingText);
  request()
    .then(() => {
      if (resetForm) evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(submitButton, false, defaultText);
    });
}
