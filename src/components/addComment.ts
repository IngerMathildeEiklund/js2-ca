import { postComment } from "../api/postsService";
import { toastNotification } from "../messages/toastnotification";
import { getLoggedInUser } from "../storage/storage";
import { transformDate } from "./renderPosts";
import type { PostWithComments } from "../api/postsService";
import type { PostComment } from "../api/postsService";

const commentsContainer = document.getElementById("comments") as HTMLElement;
export const NO_AVATAR_IMAGE = '/src/images/user.svg';

const addCommentForm = document.getElementById(
  "add-comment"
) as HTMLFormElement;
const addCommentBTN = document.getElementById(
  "add-comment-button"
) as HTMLButtonElement;
const textArea = document.getElementById("comment-text") as HTMLTextAreaElement;

export function buildComments(post: PostWithComments): HTMLElement {
  commentsContainer.innerHTML = '';
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
    commentsContainer.appendChild(buildCreatedComment(comment));
  });
  return commentsContainer;
}

const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get("id");
const postId = idParam ? Number(idParam) : null;

addCommentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (postId === null || Number.isNaN(postId)) {
    toastNotification("Could not find correct post to comment on", "error");
    return;
  }

  const commentBody = textArea.value;

  if (!commentBody) {
    return;
  }
  try {
    addCommentBTN.disabled = true;
    const response = await postComment(postId, commentBody);
    const currentUser = getLoggedInUser();
    if (!currentUser) {
      toastNotification("You must be logged in to comment", "error");
      addCommentBTN.disabled = false;
      return;
    }

    const newComment: PostComment = {
      ...response.data,
      author: currentUser
    };
    const commentElement = buildCreatedComment(newComment);
    commentsContainer?.appendChild(commentElement);

    textArea.value = "";
    buildCreatedComment(newComment);
    window.location.reload();
    toastNotification("Comment added", "success");
  } catch (error) {
    console.error(error);
  } finally {
    addCommentBTN.disabled = false;
  }
});

export function buildCreatedComment(comment: PostComment): HTMLElement {
  const commentWrapper = document.createElement("div");
  const commentOwner = document.createElement("p");
  const avatarImage = document.createElement("img");
  const ownerImgWrapper = document.createElement("div");
  const commentBody = document.createElement("div");
  const createdAt = document.createElement("p");

  commentOwner.textContent = comment.owner;
  avatarImage.src = comment.author.avatar?.url ?? NO_AVATAR_IMAGE;
  avatarImage.alt = comment.author.avatar?.alt ?? '';
  commentBody.textContent = comment.body;
  createdAt.textContent = transformDate(comment.created);

  ownerImgWrapper.classList.add("avatar-image-wrapper");
  ownerImgWrapper.append(avatarImage, commentOwner);

  commentWrapper.appendChild(ownerImgWrapper);
  commentWrapper.append(commentBody, createdAt);
  return commentWrapper;
}


