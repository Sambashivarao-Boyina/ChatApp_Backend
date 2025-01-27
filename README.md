# Chatter Backend

## Overview
This is the backend repository for the **Chatter** app, a real-time messaging application. It handles user authentication, messaging, friend requests, and notifications. The frontend repository for the app is available at: [Chatter](https://github.com/Sambashivarao-Boyina/ChatterApp.git).

## Features
- **User Authentication:**
  - Email and password authentication using **JWT**.
  - Token-based authentication for secure APIs.
- **Real-Time Messaging:**
  - Powered by **Socket.IO** for real-time communication.
- **Push Notifications:**
  - Integrated with **Firebase** for sending notifications.
- **Image Uploads:**
  - Utilizes **Cloudinary** for uploading and storing images.
- **Database:**
  - Uses **MongoDB** for managing user data, friend requests, and chat messages.

## Technology Stack
- **Node.js**: Server runtime.
- **Express.js**: Framework for building REST APIs.
- **MongoDB**: NoSQL database for data storage.
- **Socket.IO**: Real-time bidirectional communication.
- **JWT**: Secure user authentication.
- **Firebase**: Push notifications.
- **Cloudinary**: Image storage and management.

## Installation and Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Sambashivarao-Boyina/ChatApp_Backend.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and configure the following:
   ```env
   PORT=5000
   MONGO_URI=<Your MongoDB Connection URI>
   JWT_SECRET=<Your JWT Secret Key>
   CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
   CLOUDINARY_API_KEY=<Your Cloudinary API Key>
   CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
   FIREBASE_SERVER_KEY=<Your Firebase Server Key>
   ```

4. Add the Firebase Push Notification server file:
   - Create a file named `firebase.js` in the root of your project.
   - Configure Firebase Admin SDK for push notifications using your Firebase project credentials.

   Example `firebase.js`:
   ```javascript
   const admin = require("firebase-admin");

   const serviceAccount = require("./path/to/firebase-service-account.json");

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
   });

   module.exports = admin;
   ```

5. Start the server:
   ```bash
   node app.js
   ```

6. Ensure the **frontend app** is connected to this backend for full functionality.
