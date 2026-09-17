import { publishNewPost } from "../api/postsService";
import { toastNotification } from "../messages/toastnotification";
import { fetchAndRenderPosts } from "./renderPosts";
import { reRenderPosts } from "./renderPosts";

const publishPostForm = document.getElementById(
  "publish-post"
) as HTMLFormElement;

interface PublishPost {
  title: string;
  publishPost: string;
  tags: string[];
  imageUrl: string;
  imageAlt: string;
}
interface PublishPostFormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  publishPost: HTMLTextAreaElement;
  tags: HTMLInputElement;
  imageUrl: HTMLInputElement;
  imageAlt: HTMLInputElement;
}

const addOptionalImageBTN = document.getElementById(
  "add-image-button"
) as HTMLButtonElement;
addOptionalImageBTN?.addEventListener("click", (event) => {
  event.preventDefault();
  const optionalImageContainer = document.querySelector(
    ".optional-image-container"
  );
  optionalImageContainer?.classList.toggle("hidden");
});

publishPostForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const elements = publishPostForm.elements as PublishPostFormElements;

  const publishPostBTN = document.getElementById(
    "publish-post-button"
  ) as HTMLButtonElement;

  const formData: PublishPost = {
    title: elements.title.value.trim(),
    publishPost: elements.publishPost.value.trim(),
    tags: elements.tags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0),
    imageUrl: elements.imageUrl.value.trim(),
    imageAlt: elements.imageAlt.value.trim()
  };

  publishPostBTN.disabled = true;
  if (!formData.title) {
    toastNotification(
      "Missing input! Please fill out required fields before submitting,",
      "warning"
    );
    return;
  }
  const media = formData.imageUrl
    ? { url: formData.imageUrl, alt: formData.imageAlt || "No image added." }
    : undefined;
  publishPostBTN.disabled = true;

  try {
    await publishNewPost(
      formData.title,
      formData.publishPost,
      formData.tags,
      media
    );
    publishPostForm.reset();
    reRenderPosts();
  } catch (error) {
    toastNotification("Something went wrong!", "error");
    console.log("error");
  }
  publishPostBTN.disabled = false;
});
