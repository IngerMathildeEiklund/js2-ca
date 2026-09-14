import { loginUser } from "../api/authService";

interface LoginFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}
const loginForm = document.getElementById(
  "login-form"
) as HTMLFormElement | null;

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
if (!loginForm) {
  throw new Error("Login form not found in the DOM.");
}
  const elements = loginForm.elements as LoginFormElements;

  const credentials = {
    email: elements.email.value,
    password: elements.password.value
  };

  try {
    await loginUser(credentials);
    window.location.href = "./index.html";
    
    // Redirect to register and show a toast notif//
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Login failed! ${error.message}`);
    } else {
      console.error(`An unexpected error occured.`);
    }
  }
});
