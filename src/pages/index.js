import "./index.css";
import {
  settings,
  resetValidation,
  disableButton,
  enableValidation,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";

import Api from "../utils/Api.js";

// instantiate Api.js in index.js**
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ba278ba8-9c54-434a-b41c-6a65abefa049",
    "Content-Type": "application/json",
  },
});

let myUserId = "";

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    myUserId = userInfo._id;

    cards.forEach((data) => {
      const cardElement = getCardElement(data, myUserId);
      cardsList.append(cardElement);
    });
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;

    const profileAvatar = document.querySelector(".profile__avatar");
    if (profileAvatar) {
      profileAvatar.src = userInfo.avatar;
    }
  })
  .catch(console.error);

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostModal = document.querySelector("#new-post-modal");
const newPostButton = document.querySelector(".profile__new-button");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostSaveButton = newPostModal.querySelector(".modal__submit-button");

// avatar form elements
const newAvatarModal = document.querySelector("#edit-avatar-modal");
const newAvatarButton = document.querySelector(".profile__avatar-btn");
const newAvatarCloseButton = newAvatarModal.querySelector(
  ".modal__close-button"
);
const editAvatarForm = newAvatarModal.querySelector(".modal__form");
const avatarInput = document.querySelector("#profile-avatar-input");

// Delete form elements:
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector("#delete-form");
const cancelButton = deleteModal.querySelector(
  ".modal__submit-button[type='button']"
);
const deleteModalCloseButton = deleteModal.querySelector(
  ".modal__close-button_outside"
);

const editNewPostForm = newPostModal.querySelector(".modal__form");
const editImageLink = newPostModal.querySelector("#card-image-input");
const cardCaptionInput = newPostModal.querySelector("#image-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-button_type_preview"
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

handleModalOverlay(editProfileModal);
handleModalOverlay(newPostModal);
handleModalOverlay(previewModal);
handleModalOverlay(newAvatarModal);
handleModalOverlay(deleteModal);

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

//defined variable to hold the card being deleted:
let currentCardToDelete = null;

function getCardElement(data, myUserId) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImgEl = cardElement.querySelector(".card__image");

  cardImgEl.src = data.link;
  cardImgEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  cardElement.dataset.cardId = data._id;

  //like button setup
  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  // check whether card is currently liked or not
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-button_active");
  }
  // Click listener for toggling like
  cardLikeBtnEl.addEventListener("click", () => {
    const isLiked = cardLikeBtnEl.classList.contains(
      "card__like-button_active"
    );

    api
      .handleLike(data._id, isLiked)
      // in the .then, toggle active class
      .then(() => {
        cardLikeBtnEl.classList.toggle("card__like-button_active");
      })
      .catch((err) => {
        console.error("Failed to toggle like:", err);
      });
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardDeleteBtnEl.addEventListener("click", () => {
    currentCardToDelete = cardElement;
    openModal(deleteModal);
    // save reference to this card so can delete it after confirmation
  });

  cardImgEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleEscClose(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;

  const inputList = Array.from(
    editProfileForm.querySelectorAll(settings.inputSelector)
  );
  resetValidation(editProfileForm, inputList, settings);

  openModal(editProfileModal);
});

function handleModalOverlay(modal) {
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
}

editProfileCloseButton.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

// Handle Cancel
cancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
  currentCardToDelete = null;
});

// avatar close listener
newAvatarCloseButton.addEventListener("click", function () {
  closeModal(newAvatarModal);
});

//delete image form close listener
deleteModalCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

// Handle Confirm Delete
deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  if (!currentCardToDelete) return;

  const cardId = currentCardToDelete.dataset.cardId;

  if (!cardId) {
    console.warn("No card ID found. Cannot delete.");
    return;
  }

  api
    .deleteCard(cardId)
    .then(() => {
      currentCardToDelete.remove();
      currentCardToDelete = null;
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete");
    });
});

//Avatar form listener
newAvatarButton.addEventListener("click", function () {
  const inputList = Array.from(
    editAvatarForm.querySelectorAll(settings.inputSelector)
  );
  resetValidation(editAvatarForm, inputList, settings);
  openModal(newAvatarModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
  console.error("Failed to update profile:", err);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  const inputValues = {
    name: cardCaptionInput.value,
    link: editImageLink.value,
  };

  api
    .addCard(inputValues)
    .then((card) => {
      const cardElement = getCardElement(card, myUserId);
      cardsList.prepend(cardElement);

      evt.target.reset();

      const inputList = Array.from(
        editNewPostForm.querySelectorAll(settings.inputSelector)
      );
      resetValidation(editNewPostForm, inputList, settings);
      disableButton(newPostSaveButton, settings);
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error("Failed to add card:", err);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

editNewPostForm.addEventListener("submit", handleAddCardSubmit);

//event call editAvatar
function handleEditAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatar({ avatar: avatarInput.value })
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      editAvatarForm.reset();
      disableButton(submitBtn, settings);
      closeModal(newAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

editAvatarForm.addEventListener("submit", handleEditAvatarSubmit);

enableValidation(settings);
