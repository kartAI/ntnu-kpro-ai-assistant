# NTNU KPRO AI Assistant

The scope of the project consists of two primary objectives:

* **Develop a Web Application:** This platform will serve as a centralized hub, integrating the various AI models available through the KartAI project. By bringing these models together, the application will serve as a proof-of-concept (PoC), allowing KartAI to display their assortment of AI tools for different stages of the application process.

* **Create a Summary AI Assistant:** This AI-driven tool analyze documents from submitted applications and generate concise summaries, highlighting key points. The system implements a checklist matching feature. It cross-reference the building application with an official checklist and relevant regulations and inform about the quality of the application. This functionality is designed to support both applicants and case workers, enhancing the overall efficiency and clarity of the application process


## Prerequisites

Before you start, make sure the following tools are installed on your system:

- **Git:** Version control system to clone the project repository [Download Git](https://git-scm.com/downloads)
- **Docker:** To containerize the application and ensure it runs consistently across different environments [Download Docker](https://www.docker.com/products/docker-desktop)

## Setup

Start by going into the `/webapp` folder, making a copy of the `.env.example` file and renaming it to `.env`. This file contains the environment variables that the application needs to run. Open the `.env` file and update the environment variables according to your local or production setup.

## Usage

To run the project, you can use the following commands:

```bash
docker compose --env-file ./webapp/.env  --env-file ./api/.env up --build -d
```

This command will build the Docker images (if necessary) and run the containers in the background. You can access the clientside code at [http://localhost:3000](http://localhost:3000) and the API at [http://localhost:8000](http://localhost:8000).
The Swagger documentation for the API is available at [http://localhost:8000/docs](http://localhost:8000/docs).

To stop the containers, you can use the following command:

```bash
docker compose down
```

**Important:** In order to achieve the full functionality of the application, the AI models from the KartAI project must also be running. In our development we have ran them as docker containers locally on our machines. Though in the future, these will hopefully be available as public APIs.

## Documentation

- [Developer Setup](/docs/manuals/developer_setup.md)
- [T3 Start Guide](/docs/manuals/t3_guide.md)
