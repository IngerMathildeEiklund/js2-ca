27.08.2026:

prompt: What does this error mean?

changes made: Could not get the value from the input from the html as it looks for the "name", i've always just used 'document.getElementById('...'); Give the inputs their corresponsing name. 

CLAUDE AI










28.08.2026 09:37:

Prompt: Is this enough error handling in the register function?

Changes made: Added a second guard for the payload. My original code only checked if (!response) and added a check the fields the code requires (profile.name, profile.email). 

CLAUDE AI

28.08.2026 10:35:









Prompt: Can I write this code cleaner?

Changes made: Made the error handling for the different server error codes in the registration form into a switch instead of a hard to read if else statements.

CLAUDE AI.









07.09.2025 13:04: 

Prompt: The Noroff API returns a very long response object, how do I accurately tailor my code to match it? 

Changes made: Match the Noroff documentation exactly. 

CLAUDE AI. 








07.09: 2026 14:48:

Prompt: How do I get my getPosts function to return more posts? 

Changes made: Added query parameter for page and limit.

CLAUDE AI. 










10.09.2026 11:38:

Prompt: What is wrong with my functions to render one post? 

Changes made:
- Added a new interface for the getPostbyId function as it wasn't unwrapping the API response properly. 
- Separated concerns. Split the building post logic from the function that gets the id. Using the buildPost function inside the renderOnePost function to keep code DRY.











14:09.2026 12:20: 

Prompt: What is wrong with my addComment function? 

Changes made: I had some interfaces that were conflicting so I updated those, a missing function to load "profile" from storage so that when the user adds a comment, the name comes from there. And instead of having two render comments functions, one for already existing comments and one when a comment is written by the user I handled the DOM rendering in the buildCreatedComment and call that inside the buildComments forEach loop. 

CLAUDE AI.




15.09.2026 12:34:

Prompt: what is wrong with my searchForPost function?

Changes made: Was missing `encodeURIComponent` in the query.

CLAUDE AI.





16.09.2026 09:48:

Prompt: How can I implement adding images to my publishPost function? 

Changes made: Added the needed properties in the two interfaces so it would also include image urls and image alts. Also needed to const a media variable and using a ternary operator that if `formData.imageUrl`is truthy; create an object with url and alt properties, if it is falsy, media is set to undefined. 

CLAUDE AI.



