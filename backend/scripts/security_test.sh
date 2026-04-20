#!/bin/bash

# AlgoPrep Security Test Script
# Verifies Rate Limiting, Validation, and Auth Security

BASE_URL="http://localhost:8080/api/v1"

echo "=== 1. Testing Validation (Invalid Register Data) ==="
# Should return 400 with validation errors
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "not-an-email", "password": "123", "name": "A"}' | jq .

echo -e "\n=== 2. Testing Rate Limiting (Auth Attempts) ==="
# authLimiter max is 5. We'll try 6 times.
for i in {1..6}; do
  echo "Attempt $i..."
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "wrong-password"}')
  echo "Status Code: $RESPONSE"
  if [ "$RESPONSE" == "429" ]; then
    echo "SUCCESS: Rate limit triggered!"
    break
  fi
done

echo -e "\n=== 3. Testing Protected Route Security ==="
# Should return 401 Unauthorized
curl -s -X GET "$BASE_URL/auth/check" | jq .

echo -e "\n=== 4. Testing Problem Pagination Validation ==="
# Should return 400 for invalid page
curl -s -X GET "$BASE_URL/problems/get-all-problems?page=-1" | jq .

echo -e "\n=== 5. Testing UUID Validation ==="
# Should return 400 for invalid UUID
curl -s -X GET "$BASE_URL/problems/get-problem/not-a-uuid" | jq .
