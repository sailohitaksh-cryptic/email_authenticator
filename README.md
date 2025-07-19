# Full-Stack Email Subscription Service

A comprehensive web application demonstrating a full-stack development workflow using the MEAN stack (MySQL, Express.js, AngularJS, Node.js). This service captures user subscription details, provides real-time client-side validation, persists data in a relational database, and dispatches a confirmation email for testing and verification.

---

## 🚀 Live Demo

The following demonstration showcases the application's core functionality, including the dynamic UI, real-time client-side validation, and successful submission handling.

*(**Action Required**: To embed your demo, first convert your video to an animated GIF using a site like [Ezgif](https://ezgif.com/video-to-gif). Upload the GIF to your repository and replace `demo.gif` in the line below with your file's name.)*

![Application Demo](demo.gif)

A link to the full video can also be provided here: [Full Demo Video](./demo_video.mp4)

---

## ✨ Features

-   **Dynamic Frontend**: A responsive and interactive single-page application built with **AngularJS** for a modern user experience.
-   **Robust Client-Side Validation**: Provides immediate user feedback for required fields. The UI dynamically updates based on validation state:
    -   An input box turns **red** if a user clicks on it and then leaves it blank.
    -   The "Subscribe" button is **disabled** and grayed out by default.
    -   The button becomes **active and turns green** only when all form fields are filled correctly, signaling it's ready for submission.
-   **RESTful API**: A secure and efficient backend built with **Node.js** and **Express.js** to manage all business logic.
-   **Persistent & Relational Data Storage**: User information (name and email) is securely stored in a **MySQL** database, ensuring data integrity and preventing duplicate entries.
-   **Automated Email Confirmation**: Leverages **Nodemailer** to send a confirmation email to the user upon successful registration. The email body dynamically includes the user's name and email address for verification.
-   **Isolated Development Environment**:
    -   Uses **Ethereal** as a mock SMTP service to catch outgoing emails. This allows for safe and easy testing without needing real email credentials. The link to view the sent email is printed directly in the server terminal.
    -   Employs environment variables (`.env` file) to keep sensitive information like database passwords separate from the source code.

---

## 🛠️ Technology Stack

| Category      | Technology                                    |
|---------------|-----------------------------------------------|
| **Frontend** | AngularJS, HTML5, CSS3                        |
| **Backend** | Node.js, Express.js                           |
| **Database** | MySQL                                         |
| **Emailing** | Nodemailer, Ethereal                          |

---

## 🏗️ System Architecture and Flow

The application follows a standard client-server architecture. The user interacts with the AngularJS frontend, which communicates with the Node.js backend via a REST API. The backend then processes the request, interacts with the MySQL database, and sends an email through the Ethereal SMTP service.


![Professional Application Flowchart.png](https://github.com/sailohitaksh-cryptic/email_sender_app/blob/main/Professional%20Application%20Flowchart.png)

---

## ⚙️ Getting Started

Follow these instructions to set up and run the project on a local development machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or later)
-   [MySQL Server](https://dev.mysql.com/downloads/mysql/)
-   [Git](https://git-scm.com/)

### Installation and Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/sailohitaksh-cryptic/email_sender_app.git](https://github.com/sailohitaksh-cryptic/email_sender_app.git)
    cd email_sender_app
    ```

2.  **Database Configuration**
    Log in to your MySQL client and execute the following SQL to create the required database and table:
    ```sql
    CREATE DATABASE email_system;
    USE email_system;
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

3.  **Backend Dependencies and Environment**
    A. **Install NPM packages:**
    ```bash
    npm install
    ```
    B. **Set up environment variables:**
    Create a file named `.env` in the project root. Copy the contents of the block below into it and fill in your MySQL credentials.
    ```
    # .env file

    # Database Configuration
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_secret_mysql_password
    DB_NAME=email_system

    # Server Port
    PORT=3000
    ```

### Running the Application

1.  **Start the Backend Server**
    Open a terminal and run:
    ```bash
    node server.js
    ```
    The API server will be running at `http://localhost:3000`.

2.  **Launch the Frontend**
    For the best experience, run the frontend using a live server. If you are using VS Code, install the "Live Server" extension, right-click `index.html`, and select "Open with Live Server".

---

## 📖 API Documentation

The API has one primary endpoint for handling new user subscriptions.

### POST /api/subscribe

Registers a new user in the database and dispatches a confirmation email.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

**Responses:**

-   **`200 OK` (Success)**
    ```json
    {
      "message": "Subscription successful! Please check your email for confirmation.",
      "previewURL": "[https://ethereal.email/message/](https://ethereal.email/message/)..."
    }
    ```
-   **`409 Conflict` (Duplicate Email)**
    ```json
    { "message": "This email address is already subscribed." }
    ```
-   **`400 Bad Request` (Missing Data)**
    ```json
    { "message": "Name and email are required." }
    ```

---
