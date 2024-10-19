
# Car Rental Reservation System Backend 

##  Introduction
This is the backend for a Car Rental Reservation System. It handles CRUD operations for cars, bookings, user authentication, and authorization. The project is built with Node.js, Express.js, TypeScript, and MongoDB.

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