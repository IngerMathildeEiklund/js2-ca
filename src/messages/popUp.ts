import { deletePost, editOwnPost, getPostById } from "../api/postsService";
import { storage } from "../storage/storage";
import { toastNotification } from "./toastnotification";
import { renderOnePost } from "../components/renderPosts";
import type { PublishPost, EditPost } from "../api/postsService";
import { getErrorMessage } from "../errors/apiError";

export function createPopUp(postId: number): HTMLElement {
  const popUpContainer = document.getElementById(
    "pop-up-container"
  ) as HTMLDialogElement;
  popUpContainer.innerHTML = "";
  popUpContainer.classList.add("m-auto", "rounded-2xl", "border", "border-brand-softer", "bg-brand", "text-current","p-4");
  const popUpTitle = document.createElement("p");
  const popUpBody = document.createElement("p");
  const buttonsWrapper = document.createElement("div");
  const confirmBTN = document.createElement("button");
  const cancelBTN = document.createElement("button");
  popUpContainer.showModal();

  popUpTitle.textContent = "Delete post?";
  popUpTitle.classList.add("text-2xl");
  popUpBody.textContent = "This action cannot be undone.";
  confirmBTN.classList.add('btn');
  cancelBTN.classList.add('btn');


  confirmBTN.textContent = "Delete";
  cancelBTN.textContent = "Cancel";

  confirmBTN.addEventListener("click", async () => {
    try {
      await deletePost(postId);
      storage.save("postDeleted", "true");
      window.location.href = "/index.html";
    } catch (error) {
      toastNotification(getErrorMessage(error), "error");
    }
  });

  cancelBTN.addEventListener("click", () => {
    popUpContainer.close();
  });

  buttonsWrapper.classList.add("flex", "flex-row","justify-around","p-9", "gap-4");
  popUpContainer.append(popUpTitle, popUpBody);
  buttonsWrapper.append(confirmBTN, cancelBTN);
  popUpContainer.appendChild(buttonsWrapper);
  return popUpContainer;
}

interface EditPostElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  body: HTMLTextAreaElement;
  tags: HTMLInputElement;
  imageUrl: HTMLInputElement;
  imageAlt: HTMLInputElement;
}

export async function createEditPostPopUp() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const postId = Number(id);

  let post: PublishPost;

  try {
    const response = await getPostById(postId);
    if (!response) {
      toastNotification("Post not found", "error");
      return;
    }
    post = response;
  } catch (error) {
    toastNotification(getErrorMessage(error), "error");
    return;
  }

  const popUpContainer = document.getElementById(
    "edit-post-popup-container"
  ) as HTMLDialogElement;
  popUpContainer.innerHTML = "";
  const popUp = document.createElement("div");
  const popUpTitle = document.createElement("p");

  popUpContainer.classList.add("m-auto", "rounded-2xl", "border", "border-brand-softer", "bg-brand", "text-current","p-4");

  popUpTitle.textContent = "Edit post";
  popUpTitle.classList.add("text-2xl", "items-center");
  const formContainer = document.createElement("div");
  if (formContainer) {
    formContainer.innerHTML = renderEditPostForm(post);
  }
  popUpContainer.showModal();

  popUpContainer?.append(popUp, popUpTitle, formContainer);

  const cancelBTN = formContainer.querySelector(
    "#cancel-changes-button"
  ) as HTMLButtonElement;
  const saveChangesBTN = formContainer.querySelector(
    "#save-changes-button"
  ) as HTMLButtonElement;
  const editPostForm = formContainer.querySelector(
    "#edit-post-form"
  ) as HTMLFormElement;
  
  cancelBTN.classList.add('btn');
  saveChangesBTN.classList.add('btn');
  editPostForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    saveChangesBTN.disabled = true;
    if (!editPostForm) {
      return;
    }

    const elements = editPostForm.elements as EditPostElements;
    const media = elements.imageUrl?.value.trim()
      ? {
          url: elements.imageUrl.value.trim(),
          alt: elements.imageAlt?.value.trim() ?? "No image added."
        }
      : null;

    const updatedFormData: EditPost = {
      title: elements.title.value.trim(),
      body: elements.body?.value.trim(),
      tags: elements.tags?.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      media
    };

    if (!updatedFormData.title) {
      toastNotification("Must contain a title.", "warning");
    }

    console.log(id);
    if (!postId || Number.isNaN(postId)) {
      toastNotification("No post with such ID found.", "error");
      return;
    }

    try {
      await editOwnPost(postId, updatedFormData);

      renderOnePost();
      popUpContainer.close();
      editPostForm.reset();
    } catch (error) {
      toastNotification(getErrorMessage(error), "error");
    }
  });

  cancelBTN?.addEventListener("click", () => {
    popUpContainer.close();
  });
}

function renderEditPostForm(post: PublishPost) {
  return `
   <form id="edit-post-form" class="flex flex-col p-4 gap-4">
        <label for="post-title" >Post title</label>
        <input type="text" id="post-title" class="bg-brand-lighter" name="title" value="${post.title}" />
        <label for="publish-post-textarea"> Post body: Optional </label>
        <textarea
          id="publish-post-cla"
          name="body"
          rows="5"
          cols="40"
          required class="bg-brand-lighter"
        > ${post.body ?? ""}</textarea>
        <p>
        Right click and image and "Copy image address" to get an accessible url.
        </p>
        <label for="url-string"> Image:</label>
        <input id="url-string" type="url" class="bg-brand-lighter" name="imageUrl" value="${post.media?.url ?? ""}" placeholder="eg. https://unsplash.com/photos/lifeguard-chair-on-sandy-beach-8Ug4F8iM8NQ ">
        <label for="image-alt"> Describe your image: </label>
        <input type="text" id="image-alt" class="bg-brand-lighter" name="imageAlt" value="${post.media?.alt ?? ""}" placeholder="eg. A lifeguard chair on a beach">
        <label for="tags"> Tags: Optional</label>
        <input type="text" id="tags" class="bg-brand-lighter" name="tags" value="${post.tags?.join(", ") ?? ""}" />
        <div class="flex flex-row gap-4"> 
        <button id="save-changes-button" type="submit"> Save changes </button>
        <button id="cancel-changes-button" type="button"> Cancel </button>
      <div>
        </form>      
  `;
}
