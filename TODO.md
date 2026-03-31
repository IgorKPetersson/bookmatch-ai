## Fixes!

## Landing page
[x] Fix title. It says frontend now
[x] Fix tabb-icon. It is react standard icon now
[x] Fix Logotype. Change logo form texdt to an acutal logo.

## Database:
[ ] Manage, create and edit a curated book database based on booklists
[ ] Database needs to sort authors, title (international), image yes or no, isbn and more
[ ] Exclude searches for online api calls when database is online and running
[ ] Keep images as URL to save space adn to ensure latest variant is pulled

## Dashboard.jsx:
[ ] Make the SELECTED BOOK - card title smaller, it is too big.
[ ] ACCOUNT OVERVIEW - add data fields more comparable to a user login such as user / handle name and so forth
[ ] ADD a book search in the dashboard to search for books already in one of the lists. If you can't find it.
[ ] The Recently Added logic doesn't work, needs to be fixed
[ ] We should add a no delete for lists that have books in them i.e Delete books before deleting a list.

## Search.jsx:
[ ] Book Recommendations title text - too big
[ ] Book Recommendations paragraph text - too big, wrong color
[ ] AI Recommendations for You Book Title text - too big
[ ] AI Recommendations for You Drop down list menu - too big
[ ] AI Recommendations for You Drop down Add to list button - too big
[ ] AI Recommendations for You Drop down Dismiss button - too big
[ ] Results for Book search, increase the pagination/result to either 3 x 3 grid or 5 x 2 to match the AI Recommendations for You BookCard level
[ ] Results for Book search, add number of pages for the pagination of books in the result (Beginning < page number 1, 2, 3, > End)
[ ] Reading lists, make titles of lists editable (If you spell a title wrong, you should be able to edit the title name)
[ ] Stop a user from being able to add the same list twice. If the user adds Horror, the user shold be blocked from adding another list called Horror
[ ] Fix the warning message that states "This book is already saved in this list" to "This book is already saved"

## Contact.jsx
[ ] Send Message Button - get it to work by sending the message to a real mail-adress.

## Change Password
[ ] Need e-mail handler, setup a proper password change but only for registered accounts, not Oauth (google)

## Others:
[ ] Ge the forgot password / change password function to work.
[ ] Add a delete account function
[ ] Update the logotext with a real logo
[ ] Add buy-this-book functionality
[ ] Add post-this-book-on-social-media funcitonality
[ ] We catch external errors on the server side and return empty results instead of crashing.
[ ] We plan to add clear error messages for the user and retries/rate limiting.


## ADDITIONS

### Amazon + social media
In the future I also want to add 2 things.
Firstly a "buy it here" - button that would redirec the user to Amazon or something
and also a social media button that you can post the book details to
facebook or isntagram or snapchat or someting. But that is for the future.

### Change Password + mail return + two Factor password + deletion
We need a mail password reset
Two factor authentication of some sort and how do the user delete the account if they want to?
"change password" for those accounts that do a manual account?

Usual setup is:
user is logged in, goes to Your Account or Settings, fills in:
current password, new password, confirm new password
backend verifies current password.
If correct, backend hashes the new password and saves it.
That works well for non-Google accounts because you already store a hashed password for them.

A clean future version would be:
Show Change Password only for local/manual accounts and hide it for Google users

One important note:
Right now your database may not clearly distinguish manual account vs Google account, unless your friend’s backend changes added that somewhere. So the feature is doable, but you may first need a reliable way to know which login type the user has.