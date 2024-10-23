# Use the official Python image from Docker Hub
FROM python:3.11-slim

# Set environment variables to prevent Python from buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Make a new directory to put our code in.
WORKDIR /code

# Install dependencies first to leverage Docker layer caching
COPY ../requirements.txt /code/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt


# Install Tesseract OCR and other necessary dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-nor \
    libgl1-mesa-glx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code
COPY . /code/

# Expose the application port
EXPOSE 8000

# Run the application (use Uvicorn instead of FastAPI directly)
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]