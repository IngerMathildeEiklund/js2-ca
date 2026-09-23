import { toastNotification } from "../messages/toastnotification";
import { getPostById } from "../api/postsService";
import { buildComments, NO_AVATAR_IMAGE } from "./addComment";
import { createPopUp, createEditPostPopUp } from "../messages/popUp";
import { storage, getLoggedInUser, requireLogin } from "../storage/storage";
import { followUser, unfollowUser, getFollowing } from "../api/postsService";
import { renderOneProfilePage } from "./oneProfile";
import { getErrorMessage } from "../errors/apiError";
import { getCurrentPage, loadPage, setActiveQuery } from "./pagination";

import type { Post } from "../api/postsService";
import type { Profile } from "../api/postsService";
import { header } from "./loggedInUser";

const renderPostsContainer = document.getElementById("render-posts");
const renderOnePostContainer = document.getElementById(
  "render-one-post-container"
);
const loggedInUserAndAddNewPostContainer = document.getElementById(
  "loggedin-and-make-post-container"
);

const searchbar = document.getElementById("searchbar") as HTMLInputElement;
searchbar?.addEventListener("input", async () => {
  if (!searchbar) {
    return;
  }
  const query = searchbar.value.trim();
  setActiveQuery(query || null);
  await loadPage(1);
});

export function transformDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Oslo"
  });
}

export function renderPosts(
  posts: Post[],
  container: HTMLElement | null = renderPostsContainer
): void {
  if (!container) return;
  container.innerHTML = "";

  if (posts.length === 0) {
    const errorMSG = document.createElement("p");
    errorMSG.textContent = "No posts found";
    container.appendChild(errorMSG);
    return;
  }
  posts.forEach((post) => {
    const postElement = renderPostCard(post);
    container.appendChild(postElement);
  });
}
export function reRenderPosts() {
  if (!renderPostsContainer) return;
  loadPage(getCurrentPage());
}

export async function renderOnePost(): Promise<void> {
  if (!renderOnePostContainer) {
    return;
  }
  renderOnePostContainer.innerHTML = "";
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");

  if (!idParam) {
    toastNotification("ID was not found", "error");
    return;
  }

  const id = Number(idParam);
  if (Number.isNaN(id)) {
    toastNotification("Incorrect ID", "error");
    return;
  }
  try {
    const post = await getPostById(id);

    if (!post) {
      return;
    }
    const postElement = buildPost(post);
    renderOnePostContainer.appendChild(postElement);
    buildComments(post);
    const loggedInUser = getLoggedInUser();
    const isOwnPost = loggedInUser?.name === post.author.name;

    if (isOwnPost) {
      const editDeleteBTNWrapper = document.createElement("div");
      const editBTN = document.createElement("button");
      const deleteBTN = document.createElement("button");

      editBTN.textContent = "Edit post";
      deleteBTN.textContent = "Delete post";
      editDeleteBTNWrapper.classList.add("edit-delete-wrapper");
      editDeleteBTNWrapper.append(editBTN, deleteBTN);
      postElement.appendChild(editDeleteBTNWrapper);

      deleteBTN.addEventListener("click", () => {
        createPopUp(post.id);
      });
      editBTN.addEventListener("click", () => {
        createEditPostPopUp();
      });
    }
  } catch (error) {
    toastNotification(getErrorMessage(error), "error");
  }
}

function renderFollowing(profiles: Profile[]): void {
  const followingContainer = document.getElementById("following");
  if (!followingContainer) return;

  followingContainer.innerHTML = "";
  if (profiles.length === 0) {
    const notFollowingAnyone = document.createElement("p");
    notFollowingAnyone.textContent = "You are not following anyone yet.";
    followingContainer.appendChild(notFollowingAnyone);
  }
  profiles.forEach((profile) => {
    const userContainer = document.createElement("li");
    const userAvatar = document.createElement("img");
    const userName = document.createElement("span");

    userAvatar.src = profile.avatar?.url ?? "";
    userAvatar.alt = profile.avatar?.alt ?? "";
    userName.textContent = profile.name;

    userAvatar.classList.add("following-user-image");
    userContainer.classList.add("following-user-container");
    userContainer.append(userAvatar, userName);
    followingContainer.appendChild(userContainer);
  });
}
let followingArray: Profile[] = [];

async function fetchAndRenderFollowing(): Promise<void> {
  const loggedInUser = getLoggedInUser();

  if (!loggedInUser) {
    return;
  }
  try {
    const profileResponse = await getFollowing(loggedInUser.name);
    renderFollowing(profileResponse.data.following ?? []);
    followingArray = profileResponse.data.following ?? [];
    renderFollowing(followingArray);
  } catch (error) {
    toastNotification(getErrorMessage(error), "error");
  }
}

function buildPost(post: Post): HTMLElement {
  const postElement = document.createElement("div");
  const postCreator = document.createElement("p");
  const creatorAvatar = document.createElement("img");
  const creatorAvatarWrapper = document.createElement("div");
  const postTitle = document.createElement("p");
  const followBTN = document.createElement("button");

  const postBody = document.createElement("p");
  const postTags = document.createElement("div");
  const timestamp = document.createElement("p");
  const updatedTimestamp = document.createElement("p");
  const comments = document.createElement("p");
  const currentUser = getLoggedInUser();

  postCreator.textContent = post.author.name;
  let isFollowing = followingArray.some(
    (profile) => profile.name === post.author.name
  );
  followBTN.textContent = isFollowing ? "Unfollow" : "Follow";
  followBTN.classList.add(isFollowing ? "button-unfollow" : "button-follow");

  if (currentUser?.name === post.author.name) {
    followBTN.classList.add("hidden");
  } else {
    followBTN.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      followBTN.disabled = true;

      try {
        if (isFollowing) {
          await unfollowUser(post.author.name);
          followBTN.classList.remove("button-unfollow");
          followBTN.classList.add("button-follow");
          toastNotification(
            `Successfully unfollowed user ${post.author.name}`,
            "success"
          );
        } else {
          await followUser(post.author.name);
          followBTN.classList.remove("button-follow");
          followBTN.classList.add("button-unfollow");
          toastNotification(
            `You are now following ${post.author.name}`,
            "success"
          );
        }
        isFollowing = !isFollowing;
        followBTN.textContent = isFollowing ? "Unfollow" : "Follow";

        await fetchAndRenderFollowing();
        loadPage(getCurrentPage());
      } catch (error) {
        toastNotification(getErrorMessage(error), "warning");
      } finally {
        followBTN.disabled = false;
      }
    });
  }

  creatorAvatar.src = post.author.avatar?.url ?? NO_AVATAR_IMAGE;
  creatorAvatar.alt = post.author.avatar?.alt ?? "No image added";
  postTitle.textContent = post.title;

  postBody.textContent = post.body;
  postTags.textContent = `Tags: ${post.tags.join(", ")}`;
  timestamp.textContent = transformDate(post.created);
  if (post.updated > post.created) {
    timestamp.classList.add("hidden");
  }
  comments.textContent = `Comments: ${post._count.comments}`;

  if (post._count.comments === 0) {
    comments.textContent = "No comments";
  }

  postElement.classList.add("post-element");

  const timeCommentsReactionsWrapper = document.createElement("div");
  postTitle.classList.add("post-title");
  timeCommentsReactionsWrapper.classList.add("time-comments-reactions-wrapper");
  creatorAvatarWrapper.classList.add("avatar-image-wrapper");
  const postWasUpdated = post.updated !== post.created;
  if (postWasUpdated) {
    updatedTimestamp.textContent = `Edited: ${transformDate(post.updated)}`;
  } else {
    updatedTimestamp.classList.add("hidden");
  }
  if (post.tags.length === 0) {
    postTags.classList.add("hidden");
  }
  creatorAvatarWrapper.addEventListener("click", async () => {
    try {
      window.location.href = `/one-profile.html?name=${encodeURIComponent(post.author.name)}`;
    } catch (error) {
      toastNotification(getErrorMessage(error), "error");
    }
  });
  creatorAvatarWrapper.append(creatorAvatar, postCreator, followBTN);
  postElement.appendChild(creatorAvatarWrapper);
  postElement.appendChild(postTitle);

  postElement.appendChild(postBody);
  if (post.media) {
    const postImage = document.createElement("img");
    const postImageWrapper = document.createElement("div");
    postImage.src = post.media?.url ?? null;
    postImage.alt = post.media?.alt ?? "No image added";
    postImage.classList.add("image");
    postImageWrapper.classList.add("image-wrapper");
    postImageWrapper.appendChild(postImage);
    postElement.appendChild(postImageWrapper);
  }

  timeCommentsReactionsWrapper.appendChild(timestamp);
  timeCommentsReactionsWrapper.appendChild(updatedTimestamp);
  timeCommentsReactionsWrapper.appendChild(comments);

  postElement.appendChild(timeCommentsReactionsWrapper);
  postElement.appendChild(postTags);
  return postElement;
}

export function renderPostCard(post: Post): HTMLElement {
  const postElement = buildPost(post);
  postElement.addEventListener("click", () => {
    window.location.href = `/one-post.html?id=${post.id}`;
  });
  return postElement;
}
if (storage.load("postDeleted")) {
  toastNotification("Post successfully deleted.", "success");
  storage.remove("postDeleted");
}
 const oneProfileContainer = document.getElementById('one-profile-container');
 
async function init(): Promise<void> {
  if (
    !renderPostsContainer &&
    !renderOnePostContainer &&
    !loggedInUserAndAddNewPostContainer &&
    !oneProfileContainer
  ) {
    return;
  }
  requireLogin();

  if (!getLoggedInUser()) {
    return;
  }

  const headerElement = header();
  if (headerElement) {
    loggedInUserAndAddNewPostContainer?.prepend(headerElement);
  }

  await fetchAndRenderFollowing();
  await loadPage(1);
  await renderOnePost();
  await renderOneProfilePage();
}

init();
