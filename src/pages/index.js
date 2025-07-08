import logoImage from "../images/Logo.svg";
import avatarImage from "../images/avatar.jpg";
import editImage from "../images/pencil.svg";
import newPostImage from "../images/plus.svg";
import avatarEdit from "../images/avatar_edit.png";
import "../pages/index.css";
import { enableValidation, settings } from "../scripts/validation.js";
import { resetValidation } from "../scripts/validation.js";
import { renderLoading, handleSubmit } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "5400f208-aba9-428d-904b-ff28b1943db1",
    "Content-Type": "application/json",
  },
});

//Profile elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileNewPostButton = document.querySelector(
  ".profile__new-post-button"
);
const profileNameElement = document.querySelector(".profile__name");
const profileJobElement = document.querySelector(".profile__description");

//edit modal
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const nameInput = editModal.querySelector("#name-input");
const jobInput = editModal.querySelector("#description-input");
const editCloseButton = editModal.querySelector(".modal__close-button");

//card modal
const cardModal = document.querySelector("#card-modal");
const cardFormElement = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__save-button");
const cardNameInput = cardModal.querySelector("#card-name-input");
const cardLinkInput = cardModal.querySelector("#card-link-input");
const cardCloseButton = cardModal.querySelector(".modal__close-button");

//avatar modal
const avatarEditButton = document.querySelector(".avatar__edit-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarModalButton = avatarModal.querySelector(".modal__save-button");
const avatarCloseButton = avatarModal.querySelector(".modal__close-button");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//preview modal
const previewModal = document.querySelector("#preview-modal");
const previewImageElement = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewCloseButton = previewModal.querySelector(
  ".modal__close-button-preview"
);

//card declarations
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");
const deleteCancelButton = document.querySelector(".modal__save-button-cancel");

//Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

//image declarations
const avatarImg = document.getElementById("avatar_image");
avatarImg.src = avatarImage;
const logoImg = document.getElementById("logo_image");
logoImg.src = logoImage;
const editImg = document.getElementById("edit_btn");
editImg.src = editImage;
const newPost = document.getElementById("new_post");
newPost.src = newPostImage;
const avatarEditIcon = document.getElementById("avatar_edit");
avatarEditIcon.src = avatarEdit;

let selectedCard;
let selectedCardId;

api
  .getAppInfo()
  .then(([cards, users]) => {
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardList.prepend(cardElement);
    });
    avatarImg.src = users.avatar;
    profileNameElement.textContent = users.name;
    profileJobElement.textContent = users.about;
  })
  .catch((err) => {
    console.error(err);
  });

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__name");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  data.isLiked
    ? cardLikeButton.classList.add("card__like-button_liked")
    : cardLikeButton.classList.remove("card__like-button_liked");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardImageElement.addEventListener("click", () => {
    previewModalCaption.textContent = data.name;
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    openModal(previewModal);
  });

  cardDeleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

avatarEditButton.addEventListener("click", () => {
  openModal(avatarModal);
});

deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

function handleEditFormSubmit(evt) {
  function makeRequest() {
    return api
      .editUserInfo({ name: nameInput.value, about: jobInput.value })
      .then((data) => {
        profileNameElement.textContent = data.name;
        profileJobElement.textContent = data.about;
        closeModal(editModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleCardSubmit(evt) {
  function makeRequest() {
    return api
      .addNewCard({ name: cardNameInput.value, link: cardLinkInput.value })
      .then((data) => {
        const cardElement = getCardElement(data);
        cardList.append(cardElement);
        closeModal(cardModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  function makeRequest() {
    return api.deleteCard(selectedCardId).then((data) => {
      selectedCard.remove();
      closeModal(deleteModal);
    });
  }
  handleSubmit(makeRequest, evt, "Deleting...");
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_liked");
  const newLikedState = !isLiked;
  api.changeLikeStatus(id, isLiked).then((data) => {
    !isLiked
      ? evt.target.classList.add("card__like-button_liked")
      : evt.target.classList.remove("card__like-button_liked");
  });
}

function handleAvatarSubmit(evt) {
  function makeRequest() {
    return api.editAvatarInfo(avatarInput.value).then((data) => {
      avatarImg.src = data.avatar;
      avatarFormElement.reset();
      closeModal(avatarModal);
    });
  }
  handleSubmit(makeRequest, evt);
}

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
  openModal(editModal);
  resetValidation(editFormElement, [nameInput, jobInput], settings);
});

const popups = document.querySelectorAll(".modal");
popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) {
      closeModal(popup);
    }
    if (evt.target.classList.contains("modal__close-button")) {
      closeModal(popup);
    }
  });
});

profileNewPostButton.addEventListener("click", () => {
  openModal(cardModal);
});

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".modal_opened");
    closeModal(openedPopup);
  }
}

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardFormElement.addEventListener("submit", handleCardSubmit);
avatarFormElement.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
