#!/bin/sh
cd backend
black .

# mypy
mypy .
if [ $? -ne 0 ]; then
  echo "Mypy failed. Please fix the issues before committing."
  exit 1
fi

# flake8
flake8 .
if [ $? -ne 0 ]; then
  echo "Flake8 failed. Please fix the issues before committing."
  exit 1
fi

cd ..

cd frontend
npm run lint --fix

if [ $? -ne 0 ]; then
  echo "Linting failed. Please fix the issues before committing."
  exit 1
fi

exit 0
