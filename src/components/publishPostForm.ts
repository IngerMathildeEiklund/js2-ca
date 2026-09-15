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
}
interface PublishPostFormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  publishPost: HTMLTextAreaElement;
  tags: HTMLInputElement;
}
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
      .split(',')
      .map(tag => tag.trim())
      .filter((tag) => tag.length > 0)
  };
  publishPostBTN.disabled = true;
  if (!formData) {
    toastNotification('Missing input! Please fill out required fields before submitting,', 'warning');
    return;
  }
  try {

    await publishNewPost(formData.title, formData.publishPost, formData.tags);
    fetchAndRenderPosts();
    publishPostForm.reset();
    reRenderPosts();

  }catch (error) {
    toastNotification('Something went wrong!', 'error');
    console.log('error');
  }
  publishPostBTN.disabled = false;
});
