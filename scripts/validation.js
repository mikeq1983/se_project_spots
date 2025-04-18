const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save-button",
  inactiveButtonClass: "modal__save-button_disabled",
  inputErrorClass: "modal__input-error_active",
  errorClass: "modal__input_type_error"
}

const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(config.errorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.inputErrorClass);
};

const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(config.errorClass);
  errorElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  };

const checkInputValidity = (formElement, inputElement, config) => {
  if(!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  }else{
    hideInputError(formElement, inputElement, config);
  };
};

const hasInvalidInput = (inputList) => {
 return inputList.some((inputElement) => {
 return !inputElement.validity.valid;
 });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList, config)) {
   disableButton(buttonElement, config);
  } else {
   buttonElement.disabled = false;
   buttonElement.classList.remove(config.inactiveButtonClass);
  }
 };

 const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

const resetValidation = (formElement, inputList, config) => {
  inputList.forEach((input) => {
    hideInputError(formElement, input, config);
  });
}

const setEventListener = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);


  toggleButtonState(inputList, buttonElement, config);
  formElement.addEventListener("reset", () => {
    disableButton(buttonElement, config);
  });

inputList.forEach((inputElement) => {
inputElement.addEventListener("input", ()=> {
checkInputValidity(formElement, inputElement, config);
toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
  setEventListener(formElement, config);
  });
};

  enableValidation (settings);
