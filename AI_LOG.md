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



21.09.2026 11:13: 

Prompt: I can log my variable with the updated fields for my update post function, and get the correct properties, but only the title and tags get updated on the rendering of the post. What am I doing wrong? 

Changes made: Name collision, the interface `EditPost` needed body, I had given the text area the name "editPost" and used it in the wrong place. Also added the functionality that if there is no image, the whole media part is omitted. 

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



17.09.2026: 12:01:

Prompt: Im struggling to understand the API documentation for the put request for follow and unfollowing user. Can you help me undestand?

Changes made: My interfaces were wrong and not catering to the correct data, added following and followers on the Profile interface, and a proper PostResponse interface with data and meta with `Record<string, unknown>;` Then I managed to follow users, but when i wanted to log the following data, nothing worked. I then needed to create another function to actually get the information to display it. Then I had problems inside the followBTN event handler, where the state of the button was "Follow" on page reload, regardless if the user was followed or not. So I had to get the "followingArray" into the event handler for the follow button so that if the name displayed in the post also appears in the followingArray, the text content will be 'Unfollow'.  This was by far the hardest part of the assignment (thus far) as I had so many hiccups a long the way.

CLAUDE AI.




18.09.2026 12:13:

Prompt: When clicking the userimage or username I am taken to the correct html page, but nothing renders on the page except the hardcoded elements, what is my code missing? 

Changes made: Separated concerns, One function to render the profile, and one that takes care of fetching and then displaying. Also needed to get the name from the url query to get the user. 

CLAUDE AI.



