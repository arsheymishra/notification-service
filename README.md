# Notification Service

A microservice for sending notifications to users via email, SMS, and in-app channels.

## Features

- RESTful API for sending notifications and retrieving user notifications
- Support for multiple notification channels:
  - Email (using Nodemailer)
  - SMS (mock implementation, can be integrated with Twilio)
  - In-app notifications
- Message queuing with Kafka for reliable notification delivery
- Automatic retries for failed notifications with exponential backoff
- MongoDB for persistent storage of notification records
- Dockerized deployment for easy setup

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Apache Kafka
- Docker & Docker Compose

## API Endpoints

### Send a Notification
```
POST /api/notifications
```
Request body:
```json
{
  "userId": "user123",
  "type": "email",
  "message": "Your order has been shipped!",
  "recipient": "user@example.com"
}
```

### Get User Notifications
```
GET /api/users/{id}/notifications
```
Query parameters:
- `status`: Filter by status (pending, sent, failed)
- `type`: Filter by type (email, sms, in-app)
- `limit`: Limit the number of results (default: 100)

### Get Supported Notification Types
```
GET /api/notifications/types
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB (if running without Docker)
- Apache Kafka (if running without Docker)

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/notification-service
KAFKA_BROKER=localhost:9092
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### Installation

#### Using Docker (Recommended)
1. Clone the repository
2. Set up your environment variables in the `.env` file
3. Run the services using Docker Compose:
   ```
   docker-compose up -d
   ```
4. The API will be available at http://localhost:3000

#### Manual Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Make sure MongoDB and Kafka are running
4. Start the application:
   ```
   npm start
   ```
5. For development with auto-reload:
   ```
   npm run dev
   ```

## Architecture

The notification service follows a microservice architecture with the following components:

1. **API Layer**: Express.js REST API for sending and retrieving notifications
2. **Queue**: Kafka for reliable message delivery and processing
3. **Workers**: Background processes that consume messages from Kafka and send notifications
4. **Storage**: MongoDB for storing notification records and status

## Assumptions and Design Decisions

1. **Asynchronous Processing**: Notifications are processed asynchronously to ensure the API remains responsive even under high load.
2. **Retry Mechanism**: Failed notifications are automatically retried with exponential backoff to handle temporary failures.
3. **Extensibility**: The service is designed to be easily extended with additional notification channels.
4. **Scalability**: Each component (API, workers, database) can be scaled independently based on load.

## Future Improvements

1. Implement authentication and authorization
2. Add WebSocket support for real-time in-app notifications
3. Implement notification templates
4. Add support for push notifications (mobile)
5. Implement rate limiting to prevent abuse
6. Add metrics and monitoring
7. Implement batch processing for high-volume notifications
