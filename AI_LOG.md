# AI Log - All AI used was CLAUDE AI.

### 27.08.2026
**Prompt:** What does this error mean?

**Changes made:** Could not get the value from the input from the HTML — it looks for the `name` attribute, and I'd always just used `document.getElementById('...')`. Gave the inputs their corresponding `name`.

---

### 28.08.2026, 09:37
**Prompt:** Is this enough error handling in the register function?

**Changes made:** Added a second guard for the payload. My original code only checked `if (!response)`; added a check for the required fields (`profile.name`, `profile.email`).

---

### 28.08.2026, 10:35
**Prompt:** Can I write this code cleaner?

**Changes made:** Rewrote the error handling for the different server error codes in the registration form as a `switch` instead of hard-to-read if/else statements.

---

### 21.09.2026, 11:13
**Prompt:** I can log my variable with the updated fields for my update post function, and get the correct properties, but only the title and tags get updated on the rendering of the post. What am I doing wrong?

**Changes made:** Name collision — the `EditPost` interface needed `body`, but I had given the textarea the name `editPost` and used it in the wrong place. Also added functionality so that if there is no image, the whole media part is omitted.

---

### 07.09.2025, 13:04
**Prompt:** The Noroff API returns a very long response object, how do I accurately tailor my code to match it?

**Changes made:** Matched the Noroff documentation exactly.

---

### 07.09.2026, 14:48
**Prompt:** How do I get my `getPosts` function to return more posts?

**Changes made:** Added query parameters for `page` and `limit`.

---

### 10.09.2026, 11:38
**Prompt:** What is wrong with my functions to render one post?

**Changes made:**
- Added a new interface for the `getPostById` function, as it wasn't unwrapping the API response properly.
- Separated concerns — split the "build post" logic from the function that gets the ID, using the `buildPost` function inside `renderOnePost` to keep code DRY.

---

### 14.09.2026, 12:20
**Prompt:** What is wrong with my `addComment` function?

**Changes made:** Fixed some conflicting interfaces; added a missing function to load `profile` from storage so that when the user adds a comment, the name comes from there. Instead of having two render-comments functions (one for existing comments, one for user-submitted comments), handled the DOM rendering in `buildCreatedComment` and called it inside the `buildComments` forEach loop.

---

### 15.09.2026, 12:34
**Prompt:** What is wrong with my `searchForPost` function?

**Changes made:** Was missing `encodeURIComponent` in the query.

---

### 16.09.2026, 09:48
**Prompt:** How can I implement adding images to my `publishPost` function?

**Changes made:** Added the needed properties in the two interfaces so they would also include image URLs and image alts. Const'd a `media` variable using a ternary operator — if `formData.imageUrl` is truthy, create an object with `url` and `alt` properties; if falsy, `media` is set to `undefined`.

---

### 17.09.2026, 12:01
**Prompt:** I'm struggling to understand the API documentation for the PUT request for follow/unfollow user. Can you help me understand?

**Changes made:** My interfaces were wrong and didn't cater to the correct data — added `following` and `followers` to the `Profile` interface, and a proper `PostResponse` interface with `data` and `meta` as `Record<string, unknown>`. Managed to follow users, but logging the following data didn't work, so created another function to actually fetch the information to display it. Also had problems inside the follow-button event handler, where the button state showed "Follow" on page reload regardless of whether the user was actually followed. Fixed by getting the `followingArray` into the event handler, so if the name displayed on the post also appears in `followingArray`, the button text is set to "Unfollow". This was by far the hardest part of the assignment so far.

---

### 18.09.2026, 12:13
**Prompt:** When clicking the user image or username I'm taken to the correct HTML page, but nothing renders on the page except the hardcoded elements — what is my code missing?

**Changes made:** Separated concerns — one function to render the profile, one to handle fetching and then displaying. Also needed to get the name from the URL query to fetch the correct user.

---

### 21.09.2026, 13:57
**Prompt:** I want the text content from the different fields on the post to populate the form when the modal is triggered. How can I do that?

**Changes made:** Reused `getPostById` to fetch the post, used template literals in the function that returns the form HTML, and passed `post` into that function when called.

---

### 22.09.2026, 12:56
**Prompt:** How can I use the toast notification I already have to display actual messages to the user instead of generic hardcoded ones?

**Changes made:** Created a `createErrorMessage` function that returns a string, and implemented it in the toast notification calls across the app.

---

### 22.09.2026, 13:36
**Prompt:** How do I safely guard the login page so it doesn't throw a "missing authorization header" error?

**Changes made:** Added a guard clause in `init` — if the required containers aren't found, return early.

---

### 22.09.2026, 16:35
**Prompt:** My pagination logic works well when loading all posts, but disappears when I try to search for a post. How can I adjust my `searchPosts` function to accept pagination?

**Changes made:** Changed the URL in the GET function, and allowed `searchPosts` to take `page` and `limit` parameters like `getPosts`. Added a ternary on the response:
```js
const response = activeQuery
  ? await searchForPosts(activeQuery, page, POSTS_PER_PAGE)
  : await getPosts(page, POSTS_PER_PAGE);
```

---

### 24.09.2026, 10:42
**Prompt:** My function to check if the user came from `register.html` works, but it also triggers on refresh — technically correct, but not what I want. How can I improve it?

**Changes made:** Saved a `successfulRegister` flag to storage and loaded it in `checkRegister()`.

---

### 25.09.2026, 10:09
**Prompt:** ESLint doesn't like my `any` type here, but this code is from the school curriculum and I'm not sure what to change — switching `any` to `unknown` flags something else, and this is a foundational part of the code. What do I change?

**Changes made:** Replaced `ApiOptions` with:
```ts
interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}
```
