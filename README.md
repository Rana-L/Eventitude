# Eventitude

A full-stack event management web application where users can create and manage events, register as attendees, ask questions, and vote on questions submitted by other attendees.

## Features

- User registration and login with session-based authentication
- Create, update, and delete events
- Search and browse all events
- Register as an attendee for an event
- Post questions on an event page
- Upvote and downvote questions
- 404 page for unmatched routes

## Tech Stack

### Front-end
- **Vue 3** — Component-based UI framework
- **Vue Router** — Client-side routing
- **Vuetify 3** — Material Design UI components
- **Tailwind CSS** — Utility-first styling
- **Vite** — Development server and build tool

### Back-end
- **Node.js / Express** — REST API server (running on port 3333)
- **SQLite** — Lightweight relational database
- **Joi** — Request body validation
- **Mocha / Chai** — Automated testing

## Project Structure

```
Eventitude/
│
├── back-end/
│   ├── server.js               # Express app entry point
│   ├── database.js             # SQLite database setup & table creation
│   ├── db.sqlite               # SQLite database file
│   │
│   ├── app/
│   │   ├── controllers/        # Business logic
│   │   │   ├── events.js
│   │   │   ├── question.js
│   │   │   └── users.js
│   │   ├── models/             # Database queries
│   │   │   ├── events.js
│   │   │   ├── question.js
│   │   │   └── users.js
│   │   ├── routes/             # API route definitions
│   │   │   ├── events.js
│   │   │   ├── question.js
│   │   │   └── users.js
│   │   └── libs/
│   │       └── middleware.js   # Authentication middleware
│   │
│   └── tests/                  # Mocha test suites
│
└── front-end/
    └── eventitude/
        ├── src/
        │   ├── components/     # Vue components
        │   ├── router/         # Vue Router config
        │   ├── services/       # API call functions (GET, POST, PATCH, DELETE)
        │   └── main.js         # App entry point
        ├── index.html
        └── vite.config.js
```

## Database Schema

The SQLite database consists of five tables:

- **users** — Stores user accounts (name, email, hashed password, session token)
- **events** — Stores event details (name, description, location, dates, max attendees)
- **attendees** — Junction table linking users to events they have registered for
- **questions** — Questions posted by attendees on an event
- **votes** — Junction table tracking which users have voted on which questions

## API Endpoints

### Users
| Method | Endpoint | Description |
|---|---|---|
| POST | `/users` | Create a new account |
| POST | `/login` | Log in and receive a session token |
| POST | `/logout` | Log out (requires authentication) |

### Events
| Method | Endpoint | Description |
|---|---|---|
| POST | `/events` | Create a new event (requires authentication) |
| GET | `/event/:event_id` | Get a single event by ID |
| PATCH | `/event/:event_id` | Update an event (requires authentication) |
| POST | `/event/:event_id` | Register as an attendee (requires authentication) |
| DELETE | `/event/:event_id` | Delete an event (requires authentication) |
| GET | `/search` | Search events |

### Questions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/event/:event_id/question` | Post a question on an event (requires authentication) |
| DELETE | `/question/:question_id` | Delete a question (requires authentication) |
| POST | `/question/:question_id/vote` | Upvote a question (requires authentication) |
| DELETE | `/question/:question_id/vote` | Remove a vote from a question (requires authentication) |

## Getting Started

### Prerequisites
- Node.js installed — [Download here](https://nodejs.org/en/download/)
- Git installed — [Download here](https://git-scm.com/)

### Back-end

```bash
cd Eventitude/back-end
npm install
npm run dev
```

The API will be available at `http://localhost:3333`.

### Front-end

```bash
cd Eventitude/front-end/eventitude
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Running Tests

```bash
cd Eventitude/back-end

# Wipe and reset the database before testing
npm run wipe

# Run all test suites
npm run test
```
