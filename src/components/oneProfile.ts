import type { OneProfile } from "../api/postsService";

import { NO_AVATAR_IMAGE } from "./addComment";
import { toastNotification } from "../messages/toastnotification";
import { getOneProfile } from "../api/postsService";
import { renderPosts } from "./renderPosts";
import { getErrorMessage } from "../errors/apiError";
import { getProfilePosts } from "../api/postsService";

export function renderOneProfile(profile: OneProfile): HTMLElement {
  const profileContainer = document.createElement("div");
  const profileBanner = document.createElement('img');
  const avatarImage = document.createElement("img");
  const userName = document.createElement("p");
  const userBio = document.createElement("p");
  const bannerWrapper = document.createElement('div');
  const usernameAndBioWrapper = document.createElement('div');

  avatarImage.src = profile.avatar?.url ?? NO_AVATAR_IMAGE;
  avatarImage.alt = profile.avatar?.alt ?? "";
  profileBanner.src = profile.banner.url;
  profileBanner.alt = profile.banner.alt;
  

  profileBanner.classList.add("rounded-2xl");
  bannerWrapper.classList.add('relative');
  userName.textContent = `@${profile.name}`;
  userBio.textContent = profile.bio ?? "";

  avatarImage.classList.add("absolute", "left-4", "bottom-0", "translate-y-1/2",
  "size-30", "object-cover", "shrink-0", "rounded-full", "md:size-60");
  profileContainer.classList.add("flex", "flex-col", "items-center", "p-4");
  usernameAndBioWrapper.classList.add("mt-20", "text-left")
  
  usernameAndBioWrapper.append(userName, userBio)
  bannerWrapper.append(profileBanner, avatarImage)
  profileContainer.append(bannerWrapper, usernameAndBioWrapper);
  return profileContainer;
}

export async function renderOneProfilePage(): Promise<void> {
  const oneProfileContainer = document.getElementById("one-profile-container");
  const ownPostsContainer = document.getElementById("own-posts");

  if (!oneProfileContainer) {
    return;
  }
  const urlParam = new URLSearchParams(window.location.search);
  const name = urlParam.get("name");

  if (!name) {
    toastNotification("Profile not found", "error");
    return;
  }

  try {

    const [profileResponse, postsResponse] = await Promise.all([
      getOneProfile(name),
      getProfilePosts(name)
    ])
oneProfileContainer.appendChild(renderOneProfile(profileResponse.data));

if (ownPostsContainer) {
  renderPosts(postsResponse.data, ownPostsContainer);
}

  } catch (error) {
    toastNotification(getErrorMessage(error), "error");
  }
}
