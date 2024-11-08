# NTNU KPRO AI Assistant

## Prerequisites

Before you start, make sure the following tools are installed on your system:

- **Git:** Version control system to clone the project repository [Download Git](https://git-scm.com/downloads)
- **Docker:** To containerize the application and ensure it runs consistently across different environments [Download Docker](https://www.docker.com/products/docker-desktop)

## Setup

Start by going into the `/webapp` folder, making a copy of the `.env.example` file and renaming it to `.env`. This file contains the environment variables that the application needs to run. Open the `.env` file and update the environment variables according to your local or production setup.

## Usage

To run the project, you can use the following commands:

```bash
docker compose --env-file ./webapp/.env up --build -d
```

This command will build the Docker images (if necessary) and run the containers in the background. You can access the clientside code at [http://localhost:3000](http://localhost:3000) and the API at [http://localhost:8000](http://localhost:8000).
The Swagger documentation for the API is available at [http://localhost:8000/docs](http://localhost:8000/docs).

To stop the containers, you can use the following command:

```bash
docker compose down
```

## Documentation

- [Developer Setup](/docs/manuals/developer_setup.md)
- [T3 Start Guide](/docs/manuals/t3_guild.md)
