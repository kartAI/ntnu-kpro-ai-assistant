#!/bin/sh
# Run linter on staged JavaScript, TypeScript files
cd frontend
npm run lint --fix

if [ $? -ne 0 ]; then
  echo "Linting failed. Please fix the issues before committing."
  exit 1
fi

exit 0
