import { getPosts } from "../api/postsService";
import { toastNotification } from "../messages/toastnotification";
import { getPostById } from "../api/postsService";

import type { Post } from "../api/postsService";
import type { PostWithComments } from "../api/postsService";

/* const FALLBACK_IMAGE = "/src/images/fallback-img.svg"; */

const renderPostsContainer = document.getElementById("render-posts");
const renderOnePostContainer = document.getElementById(
  "render-one-post-container"
);

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
    console.log(post);
    console.log("Comments array: ", post?.comments);

    if (!post) {
      return;
    }
    const postElement = buildPost(post);
    renderOnePostContainer.appendChild(postElement);
    buildComments(post);
  } catch (error) {
    toastNotification("Something went wrong ", "error");
    console.log(error);
  }
}

function buildPost(post: Post): HTMLElement {
  const postElement = document.createElement("div");
  const postCreator = document.createElement("p");
  const creatorAvatar = document.createElement("img");
  const creatorAvatarWrapper = document.createElement("div");
  const postTitle = document.createElement("p");

  const postBody = document.createElement("p");
  const postTags = document.createElement("p");
  const timestamp = document.createElement("p");
  const updatedTimestamp = document.createElement("p");
  const comments = document.createElement("p");
  const reactions = document.createElement("p");

  postCreator.textContent = post.author.name;

  creatorAvatar.src = post.author.avatar.url ?? null;
  creatorAvatar.alt = post.author.avatar.alt ?? "No image added";
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
  creatorAvatarWrapper.append(creatorAvatar, postCreator);
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
    timeCommentsReactionsWrapper.appendChild(timestamp);
    timeCommentsReactionsWrapper.appendChild(updatedTimestamp);
    timeCommentsReactionsWrapper.appendChild(comments);
    timeCommentsReactionsWrapper.appendChild(reactions);
    postElement.appendChild(timeCommentsReactionsWrapper);
    postElement.appendChild(postTags);
  }
  return postElement;
}

export function renderPostCard(post: Post): HTMLElement {
  const postElement = buildPost(post);
  postElement.addEventListener("click", () => {
    window.location.href = `/one-post.html?id=${post.id}`;
  });
  return postElement;
}

function buildComments(post: PostWithComments): HTMLElement {
  const commentsContainer = document.getElementById("comments");
  if (!commentsContainer) {
    throw new Error("Could not find the element in the DOM.");
  }
  if (post.comments.length === 0) {
    const errormessage = document.createElement("p");
    errormessage.textContent = "No comments yet, start a discussion!";
    commentsContainer.appendChild(errormessage);
    return commentsContainer;
  }
  post.comments.forEach((comment) => {
    const commentWrapper = document.createElement("div");
    const commentOwner = document.createElement("p");
    const avatarImage = document.createElement("img");

    const ownerImgWrapper = document.createElement("div");
    const commentBody = document.createElement("p");
    const createdAt = document.createElement("p");

    commentOwner.textContent = comment.owner;
    avatarImage.src = comment.author.avatar.url;
    avatarImage.alt = comment.author.avatar.alt;
    commentBody.textContent = comment.body;
    createdAt.textContent = transformDate(comment.created);

    ownerImgWrapper.classList.add("avatar-image-wrapper");
    commentsContainer.classList.add("comments-container");

    ownerImgWrapper.append(avatarImage, commentOwner);
    commentWrapper.appendChild(ownerImgWrapper);
    commentWrapper.append(commentBody, createdAt);

    commentsContainer.appendChild(commentWrapper);
  });
  return commentsContainer;
}

renderPosts();
renderOnePost();
