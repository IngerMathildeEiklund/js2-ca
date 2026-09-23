
import { getLoggedInUser } from "../storage/storage";
import { logOut } from "../api/authService";


export function header(): HTMLElement | null{ 
    const currentProfile = getLoggedInUser();
    if (!currentProfile) {
        return null;
    }

    const loggedInUserContainer = document.createElement('div');
    const avatarNameImageContainer = document.createElement('div');
    const avatarImage = document.createElement('img');
    const userName = document.createElement('p');

    

    avatarImage.src = currentProfile?.avatar?.url ?? '';
    avatarImage.alt = currentProfile?.avatar?.alt ?? '';
    userName.textContent = `Good to see you, ${currentProfile?.name ?? ''}!`;

    const logOutBTN = document.createElement('button');
    logOutBTN.classList.add('button-log-out');
    userName.classList.add('logged-in-user-greeting');
    logOutBTN.textContent = 'Log out';
    avatarNameImageContainer.append(avatarImage, userName, logOutBTN);
    avatarNameImageContainer.classList.add('avatar-username-container');
    loggedInUserContainer.classList.add('header');
    avatarImage.classList.add('avatar-image-wrapper-header');

   
    logOutBTN.addEventListener('click', () => {
        logOut();
    })

    loggedInUserContainer.append(avatarNameImageContainer);
    return loggedInUserContainer;
}
