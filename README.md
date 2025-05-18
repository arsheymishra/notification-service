# Notification Service

A microservice for sending notifications to users via email, SMS, and in-app channels.

## Deployed Demo

A demo version of this service is deployed at: [https://notification-service-buco.onrender.com](https://notification-service-buco.onrender.com)

### API Endpoints in Demo
- Get notification types: [/api/notifications/types](https://notification-service-buco.onrender.com/api/notifications/types)
- Send notification: POST to `/api/notifications`
- Get user notifications: `/api/users/{userId}/notifications`

> **Note**: The deployed version has limited Kafka functionality as it's running without a message broker. See the [Deployment Notes](#deployment-notes) section for details.

## Features

- RESTful API for sending notifications and retrieving user notifications
- Support for multiple notification channels:
  - Email 
  - SMS 
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
MONGO_URI=
KAFKA_BROKER=localhost:9092
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

> **Note on Email Configuration**: The email service is configured but not connected to a real service in this demonstration. To use actual email delivery, you'll need to:
> 1. Set up an app-specific password if using Gmail (recommended for security)
> 2. Update the EMAIL_USER and EMAIL_PASS environment variables with your credentials
> 3. For production use, consider services like SendGrid, Mailgun, or Amazon SES instead of Gmail

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
## Architecture

The notification service follows a microservice architecture with the following components:

1. **API Layer**: Express.js REST API for sending and retrieving notifications
2. **Queue**: Kafka for reliable message delivery and processing
3. **Workers**: Background processes that consume messages from Kafka and send notifications
4. **Storage**: MongoDB for storing notification records and status

## Deployment Notes

The local development environment uses Kafka for asynchronous processing, while the deployed demo version operates without Kafka. Here's why Kafka is an important part of the architecture:

### Value of Kafka in the Notification Service

1. **Asynchronous Processing**
   - Decouples notification requests from processing
   - Improves API response times under load
   - Prevents slow notification channels from blocking the API

2. **Reliability and Fault Tolerance**
   - Message persistence ensures notifications survive service restarts
   - Automatic retries for failed notifications
   - Guaranteed delivery even during downstream service outages

3. **Scalability**
   - Horizontal scaling of notification workers
   - Load balancing across multiple consumers
   - Better handling of traffic spikes

4. **System Decoupling**
   - Service independence between senders and processors
   - Technology flexibility for future changes

## Assumptions and Design Decisions

1. **Asynchronous Processing**: Notifications are processed asynchronously to ensure the API remains responsive even under high load.
2. **Retry Mechanism**: Failed notifications are automatically retried with exponential backoff to handle temporary failures.
3. **Extensibility**: The service is designed to be easily extended with additional notification channels.
4. **Scalability**: Each component (API, workers, database) can be scaled independently based on load.

## Testing

### Email Testing
For testing email functionality without sending actual emails:

1. **Development Environment**:
   - The service logs email sending attempts without actually delivering emails
   - Check the console logs to verify email notification processing

### API Testing
Test the API endpoints using tools like Postman or curl:

```bash
# Send a test email notification
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-1",
    "type": "email",
    "subject": "Test Notification",
    "message": "This is a test notification",
    "metadata": {
      "email": "test@example.com"
    }
  }'

# Check notification status
curl http://localhost:3000/api/users/test-user-1/notifications
```

## Future Improvements

1. Implement authentication and authorization
2. Add WebSocket support for real-time in-app notifications
3. Implement notification templates
4. Add support for push notifications (mobile)
5. Implement rate limiting to prevent abuse
6. Add metrics and monitoring
7. Implement batch processing for high-volume notifications
8. Add comprehensive test suite with unit and integration tests
