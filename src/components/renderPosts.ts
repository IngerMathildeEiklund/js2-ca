import { getPosts } from "../api/postsService";
import { toastNotification } from "../messages/toastnotification";
import { getPostById } from "../api/postsService";
import { buildComments } from "./addComment";
import { searchForPosts } from "../api/postsService";
import { createPopUp } from "../messages/popUp";
import { storage } from "../storage/storage";
import { followUser, unfollowUser } from "../api/postsService";
import { getLoggedInUser } from "../storage/storage";
import { getFollowing } from "../api/postsService";
import { renderOneProfilePage } from "./oneProfile";
import { createEditPostPopUp } from "../messages/popUp";
import { getErrorMessage } from "../errors/apiError";

import type { Post } from "../api/postsService";
import type { Profile } from "../api/postsService";
import type { Meta } from "../api/postsService";
import { header } from "./loggedInUser";
import { NO_AVATAR_IMAGE } from "./addComment";

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

  if (!query) {
    return;
  }
  try {
    const result = await searchForPosts(query);
    renderPosts(result.data);
  } catch (error) {
    toastNotification(getErrorMessage(error), 'error');
  }
});

export function transformDate(date: string): string {
  return new Date(date).toDateString();
}

export function renderPosts(posts: Post[], container: HTMLElement | null = renderPostsContainer): void {
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

export async function fetchAndRenderPosts(): Promise<void> {
  try {
    const response = await getPosts(1, 100);
    if (!response?.data) {
      return;
    }
    console.log(response);
    const data = response.data;
    renderPosts(data);
  } catch (error) {
    toastNotification(getErrorMessage(error), "error");
  }
}

export function reRenderPosts() {
  if (!renderPostsContainer) return;
  fetchAndRenderPosts();
}

export async function renderOnePost(): Promise<void> {
  if (!renderOnePostContainer) {
    return;
  }
  renderOnePostContainer.innerHTML = '';
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
      editBTN.addEventListener('click', () => {
        createEditPostPopUp();
      } )
    }

    
  } catch (error) {
    toastNotification(getErrorMessage(error), "error");
  }
}

function renderFollowing(profiles: Profile[]): void {
  const followingContainer = document.getElementById("following");
  console.log("following container: ", followingContainer);
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
    toastNotification(getErrorMessage(error), 'error');
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
  const postTags = document.createElement("p");
  const timestamp = document.createElement("p");
  const updatedTimestamp = document.createElement("p");
  const comments = document.createElement("p");
  const reactions = document.createElement("p");
  const currentUser = getLoggedInUser();

  postCreator.textContent = post.author.name;
  let isFollowing = followingArray.some(
    (profile) => profile.name === post.author.name
  );
  followBTN.textContent = isFollowing ? "Unfollow" : "Follow";

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
          fetchAndRenderPosts()
          toastNotification(
            `Successfully unfollowed user ${post.author.name}`,
            "success"
          );
        } else {
          await followUser(post.author.name);
          fetchAndRenderPosts();
          toastNotification(
            `You are now following ${post.author.name}`,
            "success"
          );
        }
        isFollowing = !isFollowing;
        followBTN.textContent = isFollowing ? "Unfollow" : "Follow";
        await fetchAndRenderFollowing();
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
  updatedTimestamp.textContent = "Last updated: " + transformDate(post.updated);
  comments.textContent = `Comments: ${post._count.comments}`;
  reactions.textContent = `Reactions: ${post._count.reactions}`;

  if (post._count.comments === 0) {
    comments.textContent = "No comments yet";
  }

  if (post._count.reactions === 0) {
    reactions.classList.add("hidden");
  }

  postElement.classList.add("post-element");

  const timeCommentsReactionsWrapper = document.createElement("div");
  postTitle.classList.add("post-title");
  timeCommentsReactionsWrapper.classList.add("time-comments-reactions-wrapper");
  creatorAvatarWrapper.classList.add("avatar-image-wrapper");
  const postWasUpdated = post.updated !== post.created;
  if (postWasUpdated) {
    updatedTimestamp.textContent = `Updated: ${transformDate(post.updated)}`;
  } else {
    updatedTimestamp.classList.add("hidden");
  }
  if (post.tags.length === 0) {
    postTags.classList.add("hidden");
  }
  creatorAvatarWrapper.addEventListener('click', async () => {

    try {
      window.location.href = `/one-profile.html?name=${encodeURIComponent(post.author.name)}`
    }catch(error) {
      toastNotification(getErrorMessage(error), 'error');
    }

  })
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
  timeCommentsReactionsWrapper.appendChild(reactions);
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



async function init(): Promise<void> {

  const headerElement = header();
  if (headerElement) {
    loggedInUserAndAddNewPostContainer?.prepend(headerElement);
  }

  
  await fetchAndRenderFollowing();
  await fetchAndRenderPosts();
  await renderOnePost();
  await renderOneProfilePage();
}

init();
