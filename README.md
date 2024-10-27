Forum Application Overview

The Forum application is a Single-Page Application (SPA) built using Angular, HTML, SCSS, and TypeScript for the front-end. It is structured to provide an interactive, user-friendly interface with essential features for a forum, such as user registration, login, posting, and moderation.
Key Features Implemented

    User Registration & Authentication
        Registration: Users can register with an email and password, which are validated before being stored in the system.
        Login/Logout: Secure login and logout functionalities are provided, allowing users to access their accounts with credentials.
        Session Management: JWT (JSON Web Token) is used for authentication and session management, ensuring secure interactions between client and server.

    User Dashboard (Personal Account)
        Profile Information: Users have access to a personal profile page where they can update their information.
        User’s Posts: Users can view all posts they have created, allowing them to keep track of their contributions to the forum.

    Post Management
        Add New Post: Registered users can create new posts on the forum by providing a title, content, and optional tags.
        Post List & Details: Posts are displayed in a list format, and clicking on a post opens its detailed view.

    Comments on Posts
        Commenting System: Users can comment on posts to participate in discussions.
        View Comments: Comments are displayed beneath the respective posts, providing a thread-based interaction model.

    Post Ratings
        Average Rating Display: Each post displays an average rating based on user feedback.

    Admin Panel
        User Management: Admins can view and manage all registered users.
        Post Moderation: Admins have the rights to delete any posts on the forum to maintain content quality.
        Category Moderation: Admins can edit or delete category.

### Angular

Install the Angular CLI:

```sh
npm install -g @angular/cli
```
