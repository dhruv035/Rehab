# Order Management
This is a simple purchase order tracking app that uses mongoDB to store purchase order data and uses accest control with JWT tokens. The app is built on NextJS framework.

## Installation
use npm v18.22.0 to install the 
```node
npm install
```
## Setup .env
For local deployement create a .env.local file. You can see the example .env as well
```
JWT_KEY = ""
NEXT_PUBLIC_API=""
MONGODB_URI=""
```
The API Url is your domain, for local replace it with http://localhost:3000/api/v1
Use any JWT Key phrase to hash the password and save it securely.
The app runs on mongodb and you must enter the URI for your mongodb database.
## Run
Run the app using npm, for local testing use
```
npm run dev
```
For production you may use the following
```
npm run build
npm run start
```