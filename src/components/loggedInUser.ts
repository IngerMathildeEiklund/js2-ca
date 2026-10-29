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

  avatarImage.classList.add("cursor-pointer");

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
  logOutBTN.classList.add("btn", "mt-9", "flex", "gap-4");
  userName.classList.add("logged-in-user-greeting");
  logOutBTN.innerHTML = `Sign out <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-logout">
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
	<path d="M9 12h12l-3 -3" />
	<path d="M18 15l3 -3" />
</svg>`;
  avatarNameImageContainer.append(avatarImage, userName, logOutBTN);
  avatarNameImageContainer.classList.add("mb-9", "flex", "flex-col", "gap-1", "justify-center", "justify-items-center");
  loggedInUserContainer.classList.add("flex", "flex-row", "justify-center", "justify-items-center", "xl:ml-20");
  avatarImage.classList.add("h-60", "w-60", "object-cover", "shrink-0", "rounded-full");

  logOutBTN.addEventListener("click", () => {
    logOut();
  });

  loggedInUserContainer.append(avatarNameImageContainer);
  return loggedInUserContainer;
}
