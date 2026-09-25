import { getPosts, searchForPosts } from "../api/postsService";
import { renderPosts } from "./renderPosts";
import { toastNotification } from "../messages/toastnotification";
import { getErrorMessage } from "../errors/apiError";

import type { Meta } from "../api/postsService";

const prevBTN = document.getElementById(
  "prev-button"
) as HTMLButtonElement | null;
const nextBTN = document.getElementById(
  "next-button"
) as HTMLButtonElement | null;
const totalPagesP = document.getElementById(
  "total-pages"
) as HTMLParagraphElement | null;

let currentPage = 1;
const POSTS_PER_PAGE = 30;

let activeQuery: string | null = null;

export function getCurrentPage(): number {
  return currentPage;
}

export function setActiveQuery(query: string | null): void {
  activeQuery = query;
}

function updatePaginationControls(meta: Meta) {
  if (!prevBTN || !nextBTN) return;
  prevBTN.disabled = !meta.previousPage;
  nextBTN.disabled = !meta.nextPage;
}

export async function loadPage(page: number): Promise<void> {
  try {
    const response = activeQuery
      ? await searchForPosts(activeQuery, page, POSTS_PER_PAGE)
      : await getPosts(page, POSTS_PER_PAGE);

    currentPage = response.meta.currentPage;
    const totalPages = response.meta.pageCount;

    if (totalPagesP) {
      totalPagesP.textContent = `${currentPage} / ${totalPages}`;
    }
    renderPosts(response.data);
    updatePaginationControls(response.meta);
  } catch (error) {
    toastNotification(getErrorMessage(error), "error");
  }
}

prevBTN?.addEventListener("click", () => {
  if (!prevBTN) {
    return;
  }
  if (!prevBTN.disabled) {
    loadPage(currentPage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

nextBTN?.addEventListener("click", () => {
  if (!nextBTN) {
    return;
  }

  if (!nextBTN.disabled) {
    loadPage(currentPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});
