# Developer Setup
This document provides instructions on how to set up the project on your local machine for development purposes.

## Prerequisites
Before you start, make sure the following tools are installed on your system:
- **Git:** Version control system to clone the project repository [Download Git](https://git-scm.com/downloads)
- **Docker:** To containerize the application and ensure it runs consistently across different environments [Download Docker](https://www.docker.com/products/docker-desktop)
- **Node.js:** JavaScript runtime to run the application [Download Node.js](https://nodejs.org/en/download/)


## Setup
Start by making a copy of the `.env.example` file and renaming it to `.env`. This file contains the environment variables that the application needs to run. You can change the values of the variables to match your environment.

Run the following command in the root folder to copy the `.env.example` file:
```bash
cp .env.example .env
```
Then, you can start the database and the application with the following commands:
```bash
source start-database.sh
```

## Usage
To run the project, you can use the following commands:
```bash
npm install; npm run dev
```

This command will install the dependencies and start the application in development mode. You can access the application at `http://localhost:3000`.


## Testing
The project uses both unit tests and E2E tests to ensure the quality of the codebase.

### Unit tests
We use [Jest](https://jestjs.io/) for unit tests. You can run the tests with the following command:
```bash
npm run test
```

In addition, you can run the tests in watch mode with the following command:
```bash
npm run test:watch
```
Watch mode will re-run the tests whenever a file changes making it easier to develop new features.

### E2E tests
We use [Cypress](https://www.cypress.io/) for E2E tests. You can run the tests with the following command:

**Interactive mode:**
Run the following command in root folder to open the Cypress test runner:
```bash
npx cypress open
```

#### Headless Mode (for running tests in CI):
Run the following command in root folder to run the tests in headless mode:
```bash
npx cypress run
```