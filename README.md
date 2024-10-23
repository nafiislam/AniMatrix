# AniMatrix
**AniMatrix** is a web-based platform designed as a comprehensive wiki for Anime, Manga, Movies, and Light Novels. The site allows users to engage with various content through voting, creating watchlists, and reading lists. Users can also participate in forums and connect with others through a chat feature, fostering a community of enthusiasts.
![chobi](https://github.com/user-attachments/assets/e81b6eae-0e53-4135-bf3a-048ce9d81fc6)


## Key Functionalities

- **Search Top Ranked Contents**: Users can search and explore top-ranked Anime, Manga, Movies, and Light Novels based on community votes.
- **Content Voting**: Users can vote on content to help highlight popular titles.
- **Watchlist and Reading List**: Users can add titles to their personal watchlist or reading list for easy tracking of their viewing and reading progress.
- **Write Reviews**: Users can submit reviews for content, sharing their opinions and recommendations with the community.
- **Add Contents**: Users can contribute by adding new titles to the site’s database.
- **Edit Contents**: Users have the ability to edit existing content to ensure accuracy and completeness.
- **Forums**: Users can create and participate in forum discussions on various topics related to the content.
- **User Chat**: Connect and chat with users whom you follow, facilitating interaction and community building.
- **Push Notifications and Chat Notifications**: Users receive notifications for updates, messages, and relevant activities.
- **Subscription Option**: Users can subscribe to unlock premium or locked content for enhanced access.
- **Payment Integration**: Created an Nkash option for mobile banking payments, allowing users to make transactions easily.

- **Profile Management**: Users can manage their profiles, including preferences and settings.

## Technology Stack
- **Languages**: JavaScript (Node.js, Vanilla JS)
- **Backend**: Node.js, Express
- **Frontend**: HTML, Vanilla JavaScript, EJS (Embedded JavaScript)
- **Database**: Oracle DB
- **Version Control**: Git, GitHub
- **Package Manager**: npm

## API Integrations
- **Email Verification**:  
  Employs **Gmail Mail Server** in combination with **Nodemailer** for sending verification emails.

## Authentication Mechanisms

- **Email Verification**:  
  Ensures user authenticity through a verification link sent to the provided email address.

- **JWT (JSON Web Token) Authentication**:  
  Uses **JWT** tokens for secure session management and **bcrypt** for password hashing, ensuring secure login and data handling.

- **Real-time Communication**:  
  - **Socket.IO** for real-time chatting functionalities.
  
- **Notifications**:  
  - **Service Worker** for managing push notifications to keep users informed of updates.
  
- **Payment Integration**:  
  - Nkash for mobile banking payments.

## Database Procedures, Functions, and Triggers

* **Procedures:**
    * `follow`: Retrieves a user’s watchlist and follower information.
    * `postget`: Fetches posts, content titles, and character names for display.
    * `upvoter`: Manages upvote actions on posts.
    * `answers`: Retrieves answers associated with specific questions.
    * `getall`: Retrieves all content for users.

* **Functions:**
    * `contentidreturner`: Returns the next content ID.
    * `submissioncount`: Returns the next submission ID.
    * `idreturn`: Returns the user ID based on username.
    * `agereturn`: Returns the age of a user.
    * `typereturn`: Returns the type of content based on ID.
    * `toprank`: Returns the average rating of a specific content.
    * `topwatch`: Returns the watch count of a specific content.
    * `rank`: Returns the rank of a specific content based on its rating.
    * `namereturn`: Returns the username based on user ID.
    * `idreturner`: Returns the next user ID.
    * `isSubscribed`: Checks if a user is subscribed.
    * `islock`: Checks if content is locked.
    * `subscribe`: Manages user subscriptions.
    * `addbalance`: Adds balance to a user's account.

* **Triggers:**
    * `CONTENTDELETION`: Updates the content's source ID before deletion.
    * `USERLOGIN`: Checks for duplicate usernames before insertion.
    * `USERLOGINNAME`: Checks for duplicate usernames before updates.
    * `ONLYANIMECHECKER`: Ensures only anime content is inserted into the anime table.
    * `ONLYMANGACHECKER`: Ensures only manga content is inserted into the manga table.
    * `ONLYLIGHTNOVELCHECKER`: Ensures only light novel content is inserted into the light novel table.
    * `ONLYMOVIECHECKER`: Ensures only movie content is inserted into the movie table.
    * `INVALIDCHARACTER_LIST`: Ensures unique character entries in the character list.
    * `INVALIDSUBMISSION`: Ensures unique submissions based on title, type, and location.
    * `UPDATEEMAIL`: Updates email in the nkash table after user email change.
    * `UPDATEUPVOTE`: Updates the upvote count in the post table.


## Installation instructions
### Clone the repository:
```
git clone https://github.com/nafiislam/AniMatrix.git
```
## Navigate to the project directory:
```
cd AniMatrix
```
### First install all dependencies using the following command:
```
npm install
```

### Then run the following command to execute the website:
```
npm run devStart
```
### Configure environment variables:
Create a .env file in the project root with the following values:

```
JWT_SECRET=desfesrfaesvdzsfesraesrvcderfvesresrfefdrbv426465
JWT_PASS_SECRET=oirejtoklirmtokirtklirtjejoietjtmjjokjoifkejefndkjgnjkdgnkldgtg84641
JWT_OTP_SECRET=kmlghdrhghjjhjhhdfgfgfhgfgdfgfgfgdfhdghdhgfjmjkjxdvnfutjtfjftnftytftfyfthn1562165
GMAIL_USER=project@gmail.com
GMAIL_PASSWORD=wffdgdbne4556556503
VAPIDKEYS_PUBLIC=BIT3aYCOJdb5GnWeOXBtAG3WVJPtD_YdXWDFwKu4yrU6O9tFfsH3yKm1c-UeKFncwchlbgPGoAM-8gjgjggjg541561
VAPIDKEYS_PRIVATE=kjW0qeqUhxrk09y0s6aMfd_Ziw3Oeb0T8JQrz4fhfhf1561
SALT=100
```

### Access the application:
Open your browser and navigate to http://localhost:3000.
