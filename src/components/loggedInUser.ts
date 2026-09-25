import { getLoggedInUser } from "../storage/storage";
import { logOut } from "../api/authService";
import { toastNotification } from "../messages/toastnotification";
import { getErrorMessage } from "../errors/apiError";

export function header(): HTMLElement | null {
  const currentProfile = getLoggedInUser();
  if (!currentProfile) {
    return null;
  }

  const loggedInUserContainer = document.createElement("div");
  const avatarNameImageContainer = document.createElement("div");
  const avatarImage = document.createElement("img");
  const userName = document.createElement("p");

  avatarImage.src = currentProfile?.avatar?.url ?? "";
  avatarImage.alt = currentProfile?.avatar?.alt ?? "";
  userName.textContent = `Good to see you, ${currentProfile?.name ?? ""}!`;

  avatarImage.addEventListener("click", async () => {
    try {
      window.location.href = `/one-profile.html?name=${encodeURIComponent(currentProfile.name)}`;
    } catch (error) {
      toastNotification(getErrorMessage(error), "error");
    }
  });
  const logOutBTN = document.createElement("button");
  logOutBTN.classList.add("sign-out-button");
  userName.classList.add("logged-in-user-greeting");
  logOutBTN.innerHTML = `Sign out <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-logout">
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
	<path d="M9 12h12l-3 -3" />
	<path d="M18 15l3 -3" />
</svg>`;
  avatarNameImageContainer.append(avatarImage, userName, logOutBTN);
  avatarNameImageContainer.classList.add("avatar-username-container");
  loggedInUserContainer.classList.add("header");
  avatarImage.classList.add("avatar-image-wrapper-header");

  logOutBTN.addEventListener("click", () => {
    logOut();
  });

  loggedInUserContainer.append(avatarNameImageContainer);
  return loggedInUserContainer;
}
