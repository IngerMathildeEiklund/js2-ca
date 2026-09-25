import { loginUser } from "../api/authService";
import { getErrorMessage } from "../errors/apiError";
import { toastNotification } from "../messages/toastnotification";
import { storage } from "../storage/storage";

export function checkRegister(): void {
  if (storage.load("successfulRegister")) {
    storage.remove("successfulRegister");
    toastNotification("Register successful! You can now log in.", "success");
  }
}

checkRegister();

interface LoginFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}
const loginForm = document.getElementById(
  "login-form"
) as HTMLFormElement | null;

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const elements = loginForm.elements as LoginFormElements;

  const credentials = {
    email: elements.email.value,
    password: elements.password.value
  };

  try {
    await loginUser(credentials);
    window.location.href = "./index.html";
  } catch (error) {
    toastNotification(getErrorMessage(error), "error");
  }
});
