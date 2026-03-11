### Social login flow:

1. When user clicks on "SignIn" button, React contact "Clerk" & "Clerk" contacts Google/LinkedIn/GitHub etc servers

2. Those servers verify User creadentials and send ID token(JWT token) back to "Clerk"

3. "Clerk" creates session and allow the React app to get Social login user object with
   hooks like useAuth(),useUser(), etc...

### With these above 3 steps social login is completed

4. The React app need to navigate to either "UserDashboard " or "AuthorDashboard" after successful login

5. This navigation will be based on "role" property of User object of "Blog app"

   a. The Header component read user object from database

   b. When a User login for first time, no user obj existed in DB. In that time, the React app will redirect the user to "RoleSelection" component to select a role. After the role selection, it creates new user in DB with that specific role.

   c. If user already existed in DB, the React redirect to either "UserDashboard" or "AuthorDashboard" based on "role" property

### With the above steps of 4 & 5 , USER or AUTHOR creation is completed###

6. Actions of AUTHOR
    a. Create new Blog post
    b. Read all Blog posts
    c. Update Blog post
    d. Delete Blog post

6. Actions of USER
    a. Read Blog posts
    b. Write comment for a Blog post
   