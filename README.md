### Attribution: 
* Referenced photo-blog-spa, SPA, redux, and react router lecture code/notes from Prof. Tuck's scratch repo.
* e.g. using verifying Phoenix token example code from require_auth from photo-blog-spa, using require_auth Plug from photo-blog-spa, utilizing redux lecture code (store.js, api.js), using React code (Nav.js, Feed.js, New.js) from photo-blog-spa,

### Design Decisions:
* Email must be unique when registering for user to prevent duplicate login error. No password validation as wasn't specified. 
* Any invitee or the event owner can create a comment on the event. Only the original commenter can update the comment. Only the original commenter or the event owner can delete the comment.
* Only event owners can create or delete invites. Only user on invite can update invite.
* On home page there will be two feeds displaying all events and users. Visiting any links on events feed will take to page of event, but only invited users or event owner will be able to see event. 
* No error specification for registering user as wasn't in requirements. However form prevents empty inputs so most likely reason for any error creating user is duplicate emails. Assumed user knows how to register properly.
* On User profile, table of events owned is shown. No requirement for showing events invited so decided to not to include list of invites since users can access all events from home page or by getting shared link from event owners.
* Deleting the user profile will not automatically log the user out as they will have limited functionality regardless.
* Users can create events from before current datetime.
* None of the edit forms are filled in with current input. Anyone not logged in cannot access edit events pages. Any user can access any edit event page but submitting any changes will not go through unless the user is the event owner.
* After editing events page, page doesn't automatically reload. Need to manually refresh page to see changes. Can still make changes while on not reloaded page. Event owners can send multiple invitations to same person and can send invitations to emails that haven't registered yet. 