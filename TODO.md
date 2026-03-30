## Fixes!

## Landing page
1. [x] Fix title. It says frontend now
2. [x] Fix tabb-icon. It is react standard icon now


## Database:
[ ] Manage, create and edit a curated book database based on booklists
[ ] Database needs to sort authors, title (international), image yes or no, isbn and more
[ ] Exclude searches for online api calls when database is online and running

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

## Others:
[ ] Ge the forgot password / change password function to work.
[ ] Add a delete account function
[ ] Update the logotext with a real logo
[ ] Add buy-this-book functionality
[ ] Add post-this-book-on-social-media funcitonality
[ ] We catch external errors on the server side and return empty results instead of crashing.
[ ] We plan to add clear error messages for the user and retries/rate limiting.