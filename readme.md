
# Tech Tips & Tricks Hub

##  Introduction
The "Tech Tips & Tricks" project is a dynamic full-stack web application designed to help tech enthusiasts navigate and master the ever-evolving world of technology. Users will have access to expert advice, personal experiences, and user-generated content covering everything from troubleshooting common tech issues to learning about new software, apps, gadgets, and digital tools. The platform will cater to individuals seeking practical tech solutions, tutorials, reviews, and recommendations on products and services that enhance their digital lives. The application will feature user registration and authentication, allowing users to personalize their experience, share their own tips, upvote valuable insights, and interact with other tech enthusiasts. It will also offer premium content options via payment integration.

## 🔗 Live URL

[Tech Tips & Tricks Hub](https://a-5-l2-tech-tips-server.vercel.app/)


## Technologies Used
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Zod
- Bcrypt
- Nodemailer


## Features
- User Authentication and Authorization (JWT-based)
- CRUD Operations for Create Post and other site comment and reaction system
- Gets premium version. Access premium post and create premium post
- Using forget password by nodemailer.
- Middleware for Error Handling
- Input Validation using Zod
- Transaction and Rollback (if necessary)

- **Order Management**
  - Create a new post
  - Retrieve all Post
  - Retrieve orders by user email
  - Update inventory when a post is created


 **Clone the repository**

   ```sh
   git clone 

   cd A-5-L2-Tech-Tips-Server
  
```
📦 Install Dependencies

---
```bash

$ npm install

```
# ⚙️ Configure Environment Variables
## Create a `.env` file in the root of the project and add the following environment variables:

```bash

NODE_ENV=
BASE_URL=
FRONTEND_URL=
DB_NAME=
DATABASE_URL=
PORT=5000
BCRYPT_NUMBER=12
SECRET_ACCESS_TOKEN=
SECRET_REFRESH_TOKEN=
SECRET_ACCESS_TOKEN_TIME=10d
SECRET_REFRESH_TOKEN_TIME=365d
AAMAR_PAY_SEARCH_TNX_BASE_URL=
AAMAR_PAY_STORE_ID=aamarpaytest,
AAMAR_PAY_SIGNATURE_KEY= 
AAMAR_PAY_HIT_API= https://sandbox.aamarpay.com/jsonpost.php
EMAIL_APP_PASSWORD=


```
# Running the app

```TYPESCRIPT
# watch mode
$ npm run start


```
The server should be running on http://localhost:5000.


<!-- . -->


## Ensure the code adheres to a consistent style by running:

```TYPESCRIPT
npm run lint
```
# LINTING FIX
## Fix the code by running:
```TYPESCRIPT
npm run lint:fix

```