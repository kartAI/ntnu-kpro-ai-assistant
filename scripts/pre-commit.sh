#!/bin/sh
# Run linter on staged JavaScript, TypeScript files


cd api
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

cd webapp

exit 0
