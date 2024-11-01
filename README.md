# Fitness App Server

This is the backend server for the Fitness App, built with Node.js and Express. It manages data related to workouts, exercises, and user profiles, providing RESTful APIs for the frontend application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [Development Mode](#development-mode)
- [Available Endpoints](#available-endpoints)

## Prerequisites

Before setting up the server, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (version 14.x or higher)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/ALFIETAY/TIC2601---Node-Server.git
    cd TIC2601---Node-Server
    ```

2. **Install dependencies**: Run the following command to install the necessary packages listed in `package.json`:
    ```bash
    npm start
    ```

## Database Setup

- **Database**: This project uses a SQLite database (`database.db` file located in the `db` folder).

**Note**: If you're using a different database or want to configure the database further, you may need to edit `sequelize.js` or adjust other files as necessary.

## Running the Server

To start the server, run the following command in the project’s root directory:

```bash
node app.js
```

## API Endpoints
https://documenter.getpostman.com/view/9911964/2sAY4sk58S#ac9cba7d-4daf-455f-b463-e352dafe31c8
