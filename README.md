# Stockify

A stock price tracking application that allows users to register, log in, and view real-time and historical stock data. Users can also manage their favorite stocks and retrieve stock information from the Yahoo Finance API.

## Features

- User registration and authentication
- View real-time and historical stock data
- Manage favorite stocks
- Caching of stock data using Redis for improved performance

## Technologies Used

- **Frontend**: React, Axios, Chart.js
- **Backend**: Node.js, Express, MongoDB, Mongoose, Redis
- **External API**: Yahoo Finance API

## Architecture

The application follows a client-server architecture:

- **Client Layer**: A React application that interacts with the user.
- **API Layer**: A Node.js server that handles requests and communicates with the database and external APIs.
- **Data Layer**: MongoDB for user data and Redis for caching stock data.

## Database Design

### Users Collection

The `Users` collection will store information about each user, including their username, hashed password, and a list of their favorite stock symbols.

#### Users Collection Schema

```json
{
  "_id": "ObjectId",
  "username": "String", // Unique username for the user
  "password": "String", // Hashed password
  "favorites": [        // Array of favorite stock symbols
    "AAPL",
    "GOOGL",
    "MSFT"
  ],
  "createdAt": "Date",  // Timestamp of when the user was created
  "updatedAt": "Date"   // Timestamp of when the user was last updated
}
