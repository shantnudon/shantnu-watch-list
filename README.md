API ROUTES

POST /auth/login     - this route is used to login a user which return a jwt token
POST /auth/register  - this route is used to register a new user but currently it is commented out

(open routes)
GET      /api/list  - this route return a list of all the movies, series and animie
(auth protected routes)
POST     /api/list  - this route is used to create a new list item
PUT      /api/list  - this route is used to update a list item
DELETE   /api/list  - this route is used to delete a list item

Tech Stack used - 
MongoDB - for database
NextJS - for frontend and backend
Tailwind CSS - for styling
Vercel - for deployment

NPM packages used -
bcryptjs      -    for hashing passwords
datatables    -    to implement responsive and interactive tables
cookie        -    to store and get cookies
jsonwebtoken  -    to make and verify jwt tokens
mongoose      -    for mongodb connection and quering

.env file 
MONGODB_URI= enter your mongodb uri
JWT_SECRET= enter a secret key to be used by the JWT