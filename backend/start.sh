#!/bin/bash

# Install Tesseract OCR
# apt-get update && apt-get install -y tesseract-ocr

# Start the application
gunicorn app:app --bind 0.0.0.0:10000