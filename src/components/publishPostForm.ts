import { publishNewPost } from "../api/postsService";

const publishPostForm = document.getElementById('publish-post') as HTMLFormElement;

interface PublishPostFormElements extends HTMLFormControlsCollection {
    title: string,
    publishPost: string,
    tags: string[];
}

publishPostForm.addEventListener('submit', (event) => {
    event.preventDefault();


const elements = publishPostForm.elements as PublishPostFormElements;
const postTitle = document.getElementById('post-title') as HTMLInputElement;
const postTextArea = document.getElementById('publish-post-textarea') as HTMLTextAreaElement;
const tagInput = document.getElementById('tags') as HTMLInputElement;
const publishPostBTN = document.getElementById('publish-post-button') as HTMLButtonElement;




})


