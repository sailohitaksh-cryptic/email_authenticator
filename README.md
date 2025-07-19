# Full-Stack Email Authenticator

A secure and interactive web application demonstrating a complete two-step email verification workflow. Built with AngularJS, Node.js, and Express, this service sends a time-sensitive, randomly generated code to a user's email and verifies it to confirm ownership of the address.

---

## 🚀 Live Demo

The following demonstration showcases the application's multi-step user flow, from entering an email to successful verification with the animated checkmark.

*(**Action Required**: To embed your demo, convert your video to an animated GIF using a tool like [Ezgif](https://ezgif.com/video-to-gif). Upload the GIF to your repository and replace `demo.gif` in the line below with your file's name.)*

![Application Demo](demo.gif)

A link to the full video can also be provided here: [Full Demo Video](./demo_video.mp4)

---

## ✨ Features

-   **Two-Step Verification Flow**: A clear, multi-stage user interface that guides the user through requesting a code and then verifying it.
-   **Secure Random Code Generation**: Uses Node.js's built-in `crypto` module to generate a cryptographically strong, 16-character hexadecimal code for each request.
-   **Time-Limited Codes**: Verification codes are valid for only **10 minutes**, enhancing security. Expired codes are automatically rejected.
-   **Interactive UI with State Management**: The AngularJS frontend seamlessly transitions between three states:
    1.  Entering an email.
    2.  Entering the verification code.
    3.  A final success screen with an animated checkmark.
-   **Resend Functionality with Timer**: A "Resend code" option is available on the verification screen, which becomes clickable after a 10-second cooldown to prevent spam.
-   **Secure Configuration**: Employs environment variables (`.env` file) to keep sensitive email credentials separate from the source code.
-   **In-Memory Storage**: For this development build, verification codes are stored temporarily in a server-side `Map`, ensuring they are cleared when the server restarts.

---

## 🛠️ Technology Stack

| Category      | Technology                                    |
|---------------|-----------------------------------------------|
| **Frontend** | AngularJS, HTML5, CSS3                        |
| **Backend** | Node.js, Express.js                           |
| **Cryptography** | Node.js `crypto` module                       |
| **Emailing** | Nodemailer (using Gmail for SMTP)             |

---

## 🏗️ System Architecture and Flow

The application follows a client-server model designed for authentication. The user's browser (client) makes requests to the Node.js API (server), which handles code generation, storage, and email dispatch.

*(**Action Required**: Upload the `authenticator_flowchart.png` file to your repository and update the filename below if needed.)*

![Application Flowchart](https://github.com/sailohitaksh-cryptic/email_sender_app/blob/main/Authenticator%20Flowchart.png)

---

## ⚙️ Getting Started

Follow these instructions to set up and run the project on a local development machine.

### Prerequisites

-   [Node.js](httpshttps://nodejs.org/) (v16 or later)
-   [Git](https://git-scm.com/)

### Installation and Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/sailohitaksh-cryptic/email_sender_app.git](https://github.com/sailohitaksh-cryptic/email_sender_app.git)
    cd email_sender_app
    ```

2.  **Backend Dependencies and Environment**
    A. **Install NPM packages:**
    ```bash
    npm install
    ```
    B. **Set up environment variables:**
    This project uses a `.env` file for your email credentials. Create a file named `.env` in the project root, copy the content below into it, and fill in your details.
    ```
    # --- .env file ---

    # --- Gmail Email Configuration ---
    # Replace with your Gmail address and the 16-character App Password.
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-16-character-app-password

    # --- Server Port ---
    PORT=3000
    ```
    *(**Note**: See previous instructions on how to generate a Google App Password if needed.)*

### Running the Application

1.  **Start the Backend Server**
    Open a terminal and run:
    ```bash
    node server.js
    ```
    The API server will now be running at `http://localhost:3000`.

2.  **Launch the Frontend**
    The best way to run the frontend is with a live server. In VS Code, install the "Live Server" extension, then right-click `index.html` and select "Open with Live Server".

---

## 📖 API Documentation

The backend exposes two API endpoints to manage the authentication flow.

### 1. Send Verification Code
-   **Endpoint**: `/api/send-code`
-   **Method**: `POST`
-   **Description**: Generates a 16-character code, stores it with the user's email, and sends it.
-   **Request Body**:
    ```json
    { "email": "user@example.com" }
    ```
-   **Success Response** (`200 OK`):
    ```json
    { "message": "Verification code sent successfully." }
    ```

### 2. Verify Code
-   **Endpoint**: `/api/verify-code`
-   **Method**: `POST`
-   **Description**: Verifies the code submitted by the user against the stored code.
-   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "code": "A1B2C3D4E5F6A7B8"
    }
    ```
-   **Success Response** (`200 OK`):
    ```json
    { "message": "✅ Email successfully authenticated!" }
    ```
-   **Error Responses** (`400 Bad Request`):
    -   `{ "message": "Your verification code has expired. Please request a new one." }`
    -   `{ "message": "Invalid code. Please try again." }`

---

## 🔮 Future Enhancements

-   **Persistent Code Storage**: Replace the in-memory `Map` with a more robust solution like **Redis** (for caching) or a **SQL database table** to persist codes across server restarts.
-   **Rate Limiting**: Implement IP-based rate limiting on the `/api/send-code` endpoint to prevent abuse and spam.
-   **User Account Integration**: Upon successful verification, create a user account in the database and issue a session token (JWT) for a full login system.
-   **WebSockets for Real-time Updates**: Use WebSockets to provide more instantaneous feedback to the user without needing to poll for status changes.
