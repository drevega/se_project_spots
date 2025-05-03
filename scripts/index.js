const initialCards = [
  {
    name: "Izzy Gerosa",
    link: "https://unsplash.com/photos/person-holding-instant-camera-xniTNHp4UVE",
  },
  {
    name: "Cafe Spot",
    link: "https://unsplash.com/photos/a-person-works-on-a-laptop-by-a-window-TbSfPIhtfbg",
  },
  {
    name: "City sunset",
    link: "https://unsplash.com/photos/empire-state-building-new-york-at-night-fT6-YkB0nfg",
  },
  {
    name: "Tokyo scene",
    link: "https://unsplash.com/photos/red-staircase-bar-handle-OiERUvVrioU",
  },
  {
    name: "GTO",
    link: "https://unsplash.com/photos/a-view-of-a-city-with-mountains-in-the-background-k_VqQKvuaT8",
  },
  {
    name: "Moonset",
    link: "https://unsplash.com/photos/a-full-moon-rising-over-a-mountain-range-CWTz1ZE2IUE",
  },
];

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

const newPostButton = document.querySelector(".profile__new-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");

const editNewPostForm = newPostModal.querySelector(".modal__form");
const editImageLink = newPostModal.querySelector("#card-image-input");
const editCaptionModal = newPostModal.querySelector("#image-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  editProfileModal.classList.add("modal_is-opened");
});

editProfileCloseButton.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});

newPostButton.addEventListener("click", function () {
  newPostModal.classList.add("modal_is-opened");
});

newPostCloseButton.addEventListener("click", function () {
  newPostModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  editProfileModal.classList.remove("modal_is-opened");
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  console.log(editImageLink.value);
  console.log(editCaptionModal.value);
  newPostModal.classList.remove("modal_is-opened");
}

editNewPostForm.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach(function (item) {
  console.log(item.name);
  console.log(item.link);
});
