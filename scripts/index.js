const initialCards = [
  {name: "Val Thorens",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"},
  {name: "Restaurant terrace",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"},
  {name: "An outdoor cafe",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"},
  {name: "A very long bridge, over the forest and through the trees",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"},
  {name: "Tunnel with morning light",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"},
  {name: "Mountain house",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"},
  {name: "Golden gate bridge",
  link: " https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"},
];

const profileEditButton = document.querySelector(".profile__edit-button");
const profileNewPostButton = document.querySelector(".profile__new-post-button");
const profileNameElement = document.querySelector(".profile__name");
const profileJobElement = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const nameInput = editModal.querySelector("#name-input");
const jobInput = editModal.querySelector("#description-input");
const editCloseButton = editModal.querySelector(".modal__close-button");


const cardModal = document.querySelector("#card-modal");
const cardFormElement = cardModal.querySelector(".modal__form");
const cardSubmitButton= cardModal.querySelector(".modal__save-button");
const cardNameInput = cardModal.querySelector("#card-name-input");
const cardLinkInput = cardModal.querySelector("#card-link-input");
const cardCloseButton = cardModal.querySelector(".modal__close-button");

const previewModal = document.querySelector("#preview-modal");
const previewImageElement = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewCloseButton = previewModal.querySelector(".modal__close-button-preview");

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list")


function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__name");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

   cardNameElement.textContent = data.name;
   cardImageElement.src = data.link;
   cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  cardImageElement.addEventListener("click", () => {
    previewModalCaption.textContent = data.name;
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    openModal(previewModal);
  });

  cardDeleteButton.addEventListener("click", () => {
    const card = cardDeleteButton.closest(".card");
    card.remove ();
  });

   return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  if (modal === cardModal) {
    const inputList = Array.from(modal.querySelectorAll(settings.inputSelector));
    const buttonElement = modal.querySelector(settings.submitButtonSelector);
    toggleButtonState(inputList, buttonElement, settings);
  }
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  closeModal(editModal);
}

function handleCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value};
  const cardElement = getCardElement(inputValues);
  cardList.prepend(cardElement);
  cardFormElement.reset();
  disableButton(cardSubmitButton);
  closeModal(cardModal);
}

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
  openModal (editModal)
});

editCloseButton.addEventListener("click", () => {
  closeModal(editModal)
});

editModal.addEventListener('click', (event) => {
  if (event.target === event.currentTarget) {
  closeModal(editModal);
  }
});

profileNewPostButton.addEventListener("click", () => {
  openModal (cardModal);
});

cardModal.addEventListener('click', (event) => {
  if (event.target === event.currentTarget) {
  closeModal(cardModal);
  }
});

cardCloseButton.addEventListener("click", () => {
  closeModal(cardModal)
});

previewCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

previewModal.addEventListener('click', (event) => {
  if (event.target === event.currentTarget) {
  closeModal(previewModal);
  }
});

document.addEventListener("keydown", function (evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal)
      openModal.classList.remove("modal_opened");
    }
  });

editFormElement.addEventListener('submit', handleEditFormSubmit);
cardFormElement.addEventListener('submit', handleCardSubmit);

initialCards.forEach(function (item) {
  const cardElement = getCardElement(item);
  cardList.prepend(cardElement);
});