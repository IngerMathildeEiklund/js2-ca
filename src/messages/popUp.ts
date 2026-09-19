import { deletePost } from "../api/postsService";
import { storage } from "../storage/storage";

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
      storage.save('postDeleted', 'true');
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



export function createEditPostPopUp() {
  const popUpContainer = document.getElementById('edit-post-popup-container') as HTMLDialogElement;
  const popUp = document.createElement('div');
  const popUpTitle = document.createElement('p');

  popUpTitle.textContent = 'Edit post';
  const formContainer = document.createElement('div');
  if (formContainer) {
      formContainer.innerHTML = renderEditPostForm();
  }
  popUpContainer.showModal();


  popUpContainer?.append(popUp,popUpTitle, formContainer);

  const cancelBTN = formContainer.querySelector('#cancel-changes-button');
  const saveChangesBTN = formContainer.querySelector('#save-changes-button');

      cancelBTN?.addEventListener('click', () => {
    popUpContainer.close();
  })
saveChangesBTN?.addEventListener('click', () => {
  console.log('Run the dang put function here!!!!!');
})
  
}



function renderEditPostForm() {
  return `
   <form id="edit-post-form">
        <label for="post-title">Post title</label>
        <input type="text" id="post-title" name="title" />
        <label for="publish-post-textarea"> Post body: Optional </label>
        <textarea
          id="publish-post-textarea"
          name="publishPost"
          rows="5"
          cols="40"
          required
        >
        </textarea>
                  <details>
          Note! Not all urls can be used. Get the right format by right clicking an image and selecting "Copy image address".
        </details>
        <label for="url-string"> Image:</label>
        <input id="url-string" type="url" name="imageUrl" placeholder="eg. https://unsplash.com/photos/lifeguard-chair-on-sandy-beach-8Ug4F8iM8NQ ">
        <label for="image-alt"> Describe your image: </label>
        <input type="text" id="image-alt" name="imageAlt" placeholder="eg. A lifeguard chair on a beach">
      


        <label for="tags"> Tags: Optional</label>
        <input type="text" id="tags" name="tags" />
        <div> 
        <button id="save-changes-button" type="submit"> Save changes </button>
        <button id="cancel-changes-button" type="button"> Cancel changes </button>
      <div>
        </form>      
  `;
}


// next step, get the form data, and on submit, run the editPost put function with the formdata.//

