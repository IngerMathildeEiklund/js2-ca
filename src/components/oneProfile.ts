import type { OneProfile } from "../api/postsService";
import { NO_AVATAR_IMAGE } from "./addComment";
import { toastNotification } from "../messages/toastnotification";
import { getOneProfile } from "../api/postsService";
import { renderPosts } from "./renderPosts";
import { getPosts } from "../api/postsService";

export function renderOneProfile(profile: OneProfile): HTMLElement{
const profileContainer = document.createElement('div');
const avatarImage = document.createElement('img');
const userName = document.createElement('p');
const userBio = document.createElement('p');

avatarImage.src = profile.avatar?.url ?? NO_AVATAR_IMAGE;
avatarImage.alt = profile.avatar?.alt ?? '';
userName.textContent = profile.name;
userBio.textContent = profile.bio ?? '';

avatarImage.classList.add('profile-avatar-image');
profileContainer.classList.add('profile-container');
userName.classList.add('profile-username');



profileContainer.append(avatarImage, userName, userBio);
return profileContainer;
}


export async function renderOneProfilePage(): Promise<void> {
const oneProfileContainer = document.getElementById('one-profile-container');
const ownPostsContainer = document.getElementById('own-posts');

if (!oneProfileContainer) {
    return;
}
const urlParam = new URLSearchParams(window.location.search);
const name = urlParam.get('name');

if (!name) {
toastNotification('Profile not found', 'error');
return;
}

try {
const response = await getOneProfile(name);
const profileElement = renderOneProfile(response.data);
oneProfileContainer.appendChild(profileElement);

const profileTile = document.getElementById('profile-page');
if (!profileTile) {
    return;
}
profileTile.textContent = `${name}'s Profile`;

const allPosts = await getPosts(1, 100);
const allPostOwn = allPosts.data.filter((post) => post.author.name === name);
renderPosts(allPostOwn)

if (ownPostsContainer) {
renderPosts(allPostOwn, ownPostsContainer);
}

}catch(error) {
console.log('hello!');
}
}







