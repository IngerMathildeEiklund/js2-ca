import { getPosts } from "../api/postsService";
import { toastNotification } from "../messages/toastnotification";
import { getPostById } from "../api/postsService";

import type { Post } from "../api/postsService";

const FALLBACK_IMAGE = "/src/images/fallback-img.svg";

const renderPostsContainer = document.getElementById("render-posts");
const renderOnePostContainer = document.getElementById(
  "render-one-post-container"
);
const commentsContainer = document.getElementById("comments");

function transformDate(date: string): string {
  return new Date(date).toDateString();
}

export async function renderPosts(): Promise<void> {
  if (!renderPostsContainer) return;
  try {
    const response = await getPosts(1, 100);
    if (!response?.data) {
      console.log("No posts found");
      return;
    }
    const data = response.data;

    data.forEach((post) => {
      const postElement = renderPostCard(post);
      renderPostsContainer.appendChild(postElement);
    });
  } catch (error) {
    toastNotification("Error fetching posts", "error");
    return;
  }
}

export async function renderOnePost(): Promise<void> {
  if (!renderOnePostContainer) {
    return;
  }
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
    console.log("Comments array: ", post?.comments);
    if (!post) {
      return;
    }
    const postElement = buildPost(post);
    renderOnePostContainer.appendChild(postElement);
  } catch (error) {
    toastNotification('Something went wrong ', 'error');
  }
}

function buildPost(post: Post): HTMLElement {
  const postElement = document.createElement("div");
  const postTitle = document.createElement("p");
  const postImage = document.createElement("img");
  const postImageWrapper = document.createElement("div");
  const postBody = document.createElement("p");
  const postTags = document.createElement("p");
  const timestamp = document.createElement("p");
  const updatedTimestamp = document.createElement("p");
  const comments = document.createElement("p");
  const reactions = document.createElement("p");

  postTitle.textContent = post.title;
  postImage.src = post.media?.url ?? FALLBACK_IMAGE;
  postImage.alt = post.media?.alt ?? "Fallback image";
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
  postImage.classList.add("image");
  postImageWrapper.classList.add("image-wrapper");
  const timeCommentsReactionsWrapper = document.createElement("div");
  postTitle.classList.add("post-title");
  timeCommentsReactionsWrapper.classList.add("time-comments-reactions-wrapper");

  const postWasUpdated = post.updated !== post.created;
  if (postWasUpdated) {
    updatedTimestamp.textContent = `Updated: ${transformDate(post.updated)}`;
  } else {
    updatedTimestamp.classList.add("hidden");
  }
  if (post.tags.length === 0) {
    postTags.classList.add("hidden");
  }

  postElement.appendChild(postTitle);
  postImageWrapper.appendChild(postImage);
  postElement.appendChild(postImageWrapper);
  postElement.appendChild(postBody);
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

/* function renderComments(post: Post): HTMLElement {
  const comment = document.createElement("div");

} */

renderPosts();
renderOnePost();
