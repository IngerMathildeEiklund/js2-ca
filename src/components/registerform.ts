import { registerUser } from "../api/authService";
import { ApiError, getErrorMessage } from "../errors/apiError";
import { toastNotification } from "../messages/toastnotification";
import { storage } from "../storage/storage";

interface RegisterUser {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: {
    url: string;
    alt: string;
  };
}

interface RegisterFormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
  confirmPassword: HTMLInputElement;
  bio: HTMLInputElement;
  avatarUrl: HTMLInputElement;
  avatarAlt: HTMLInputElement;
}

const registrationForm = document.getElementById(
  "registration-form"
) as HTMLFormElement;

const submitBTN = document.getElementById("submit-button") as HTMLButtonElement;

registrationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const elements = registrationForm.elements as RegisterFormElements;

  const avatarUrl = elements.avatarUrl.value.trim();
  const avatarAlt = elements.avatarAlt.value.trim();

  const formData: RegisterUser = {
    name: elements.name.value.trim(),
    email: elements.email.value.trim().toLowerCase(),
    password: elements.password.value,
    bio: elements.bio.value.trim(),
    avatar: avatarUrl
      ? { url: avatarUrl, alt: avatarAlt || "No image added." }
      : undefined
  };
  const confirmPassword = elements.confirmPassword.value;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
  const usernamePattern = /^[a-zA-Z0-9_]+$/;

  if (!emailRegex.test(formData.email)) {
    toastNotification(
      'Please use a valid email format, "@stud.noroff.no" ',
      "warning"
    );

    return;
  } else if (formData.password.length < 8) {
    toastNotification("Password must contain atleast 8 characters.", "warning");

    return;
  } else if (formData.password !== confirmPassword) {
    toastNotification("Passwords do not match", "warning");

    return;
  } else if (!usernamePattern.test(formData.name)) {
    toastNotification(
      "Invalid username format. Please only use letters, numbers and underscores.",
      "warning"
    );

    return;
  }
  if (submitBTN) submitBTN.disabled = true;

  try {
    await registerUser(formData);
    storage.save("successfulRegister", "1");
    window.location.href = "./login.html";
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 409:
          toastNotification("Credentials already in use.", "warning");

          break;
        case 400:
          toastNotification(error.message, "error");

          break;
        case 429:
          toastNotification(
            "Too many requests, please try again later.",
            "error"
          );

          break;
        case 500:
          toastNotification("Please try again later.", "error");

          break;
        default:
          toastNotification("Please try again later.", "error");
      }
    } else if (error instanceof Error) {
      toastNotification(error.message, "error");
    } else {
      toastNotification(getErrorMessage(error), "error");
    }
  } finally {
    if (submitBTN) submitBTN.disabled = false;
  }
});
