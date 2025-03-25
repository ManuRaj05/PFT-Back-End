# Backend API Documentation

## Overview
This backend is part of the Personal Finance Tracker application. It is built using Node.js and Express.js, with MongoDB as the database. The backend provides RESTful APIs for managing user authentication, accounts, incomes, expenses, savings, and saving goals.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- `.env` file with the following variables:
  ```env
  PORT=8080
  MONGO_URI=<your_mongo_connection_string>
  JWT_SECRET=<your_jwt_secret>
  ```

## Installation
1. Clone the repository.
2. Navigate to the `backend` directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   For development with hot-reloading:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
**Base URL:** `/api/auth`
- **POST** `/register`: Register a new user.
  - Request Body:
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "message": "User registered successfully",
      "user": { ... }
    }
    ```
- **POST** `/login`: Authenticate a user and return a token.
  - Request Body:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "token": "string"
    }
    ```

### Accounts
**Base URL:** `/api/accounts`
- **GET** `/`: Get all accounts for the authenticated user.
- **POST** `/`: Create a new account.
  - Request Body:
    ```json
    {
      "name": "string",
      "type": "string",
      "balance": "number"
    }
    ```

### Incomes
**Base URL:** `/api/incomes`
- **GET** `/`: Get all incomes for the authenticated user.
- **POST** `/`: Add a new income.
  - Request Body:
    ```json
    {
      "source": "string",
      "amount": "number",
      "date": "string"
    }
    ```

### Expenses
**Base URL:** `/api/expenses`
- **GET** `/`: Get all expenses for the authenticated user.
- **POST** `/`: Add a new expense.
  - Request Body:
    ```json
    {
      "category": "string",
      "amount": "number",
      "date": "string"
    }
    ```

### Savings
**Base URL:** `/api/savings`
- **GET** `/`: Get all savings for the authenticated user.
- **POST** `/`: Add a new saving.
  - Request Body:
    ```json
    {
      "goal": "string",
      "amount": "number",
      "date": "string"
    }
    ```

## Models
- **User**: Stores user information.
- **Account**: Stores account details.
- **Income**: Stores income records.
- **Expense**: Stores expense records.
- **SavingGoal**: Stores saving goals.
- **Savings**: Stores savings records.

## Middleware
- **Auth Middleware**: Protects routes by verifying JWT tokens.

## Database
The database connection is managed in `config/database.js`. Ensure the `MONGO_URI` environment variable is correctly set.

## License
This project is licensed under the ISC License.