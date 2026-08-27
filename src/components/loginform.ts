import { loginUser } from "../api/authService";

interface LoginFormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
}
const loginForm = document.getElementById('login-form') as HTMLFormElement;


loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const elements = loginForm.elements as LoginFormElements;

    const credentials = {
        email: elements.email.value,
        password: elements.password.value
    }

    try {
        const profile = await loginUser(credentials);
        console.log(`Welcome back,  ${profile.name}!`);

        setTimeout(() => {
            window.location.href= './register.html'
        },2000);
    }catch(error: unknown) {
        if (error instanceof Error) {
            console.error(`Login failed! ${error.message}`);
        }else{
            console.error(`An unexpected error occured.`);
        }
    }
});