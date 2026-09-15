import { deletePost } from "../api/postsService";

export function createPopUp(postId: number): HTMLElement {
    const popUpContainer = document.getElementById('pop-up-container');
  const popUp = document.createElement("div");
  const popUpTitle = document.createElement("p");
  const popUpBody = document.createElement("p");
  const buttonsWrapper = document.createElement("div");
  const confirmBTN = document.createElement("button");
  const cancelBTN = document.createElement("button");

  popUpTitle.textContent = "Are you sure you want to delete post?";
  popUpBody.textContent = "This action cannot be undone.";

  confirmBTN.textContent = "Delete";
  cancelBTN.textContent = "Cancel";

  confirmBTN.addEventListener("click", async () => {
    try {
      await deletePost(postId);
      window.location.href = '/index.html';
    } catch (error) {
      console.log(error);
    }
  });

  cancelBTN.addEventListener("click", () => {
    popUp.remove();
  });

  popUp.classList.add("popUpContainer");
  buttonsWrapper.classList.add("confirm-and-cancel-button-wrapper");
  popUp.append(popUpTitle, popUpBody);
  buttonsWrapper.append(confirmBTN, cancelBTN);
  popUp.appendChild(buttonsWrapper);
  popUpContainer?.appendChild(popUp);
  return popUp;
}
