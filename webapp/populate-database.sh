#!/usr/bin/env bash
# Use this script to populate the generated database from start-database.sh
# Run start-database.sh before this, or else it will crash

# TO RUN ON WINDOWS:
# 1. Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
# 2. Install Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
# 3. Open WSL - `wsl`
# 4. Run this script - `./populate-database.sh`

DB_CONTAINER_NAME="ntnu-kpro-ai-assistant-mysql"

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo -e "Docker is not installed. Please install Docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

# Check if the database container is running
if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "Database container '$DB_CONTAINER_NAME' is already running."
else
  echo "Database container '$DB_CONTAINER_NAME' is not running."

  # Check if the container exists but is stopped
  if [ "$(docker ps -q -a -f name=$DB_CONTAINER_NAME)" ]; then
    echo "Starting existing container '$DB_CONTAINER_NAME'..."
    docker start "$DB_CONTAINER_NAME"
    echo "Container started."
  else
    echo "Database container '$DB_CONTAINER_NAME' does not exist. Please run start-database.sh first."
    exit 1
  fi
fi

# Proceed with the population steps
echo "Populating the database..."

npx prisma db push
npx prisma generate

# Check if xml_storage.py exists
if [ -f "xml_storage.py" ]; then
  python3 xml_storage.py
  echo "Database populated successfully."
else
  echo "xml_storage.py not found. Please make sure the script exists."
  exit 1
fi
