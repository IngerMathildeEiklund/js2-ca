type MessageType = "success" | "warning" | "error";

export function toastNotification(message: string, type: MessageType): void {
  const toastContainer = document.getElementById("toast-container");
  if (!toastContainer) return;

  const toastElement = document.createElement("div");
  toastElement.setAttribute("role", "status");
  toastElement.classList.add("toast", type);
  toastElement.textContent = message;
  toastContainer.appendChild(toastElement);

  const timeoutID = setTimeout(() => {
    toastElement.remove();
  }, 8000);

  toastElement.addEventListener("click", () => {
    clearTimeout(timeoutID);
    toastElement.remove();
  });
}
