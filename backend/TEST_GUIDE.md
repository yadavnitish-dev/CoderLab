# AlgoPrep Service Layer - Testing Guide

## Pre-requisites
- Backend running on `http://localhost:8080`
- Database connected and migrated
- Postman or terminal with `curl` available

---

## 1. AUTH SERVICE TESTS

### 1.1 Register User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```
✅ Expected: 201, user object + JWT cookie

### 1.2 Login User
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }'
```
✅ Expected: 200, user object + JWT cookie

### 1.3 Check Auth (Protected Route)
```bash
curl -X GET http://localhost:8080/auth/check \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE"
```
✅ Expected: 200, authenticated user details

### 1.4 Update Profile
```bash
curl -X PUT http://localhost:8080/auth/update-profile \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Updated Name"
  }'
```
✅ Expected: 200, updated user object

### 1.5 Update Password
```bash
curl -X PUT http://localhost:8080/auth/update-password \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newpassword123"
  }'
```
✅ Expected: 200, success message

### 1.6 Logout
```bash
curl -X POST http://localhost:8080/auth/logout \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE"
```
✅ Expected: 200, JWT cookie cleared

---

## 2. PROBLEM SERVICE TESTS

### 2.1 Get All Problems (Public Route - No Auth Required)
```bash
curl -X GET "http://localhost:8080/problem/get-all-problems?page=1&limit=10"
```
✅ Expected: 200, array of problems with pagination

### 2.2 Create Problem (Requires Auth)
```bash
curl -X POST http://localhost:8080/problem/create-problem \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
    "difficulty": "EASY",
    "tags": ["array", "hash-table"],
    "examples": [
      {
        "input": "[2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "nums[0] + nums[1] == 9, return [0, 1]"
      }
    ],
    "constraints": "1 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9",
    "testcases": [
      {"input": "[2,7,11,15]\\n9", "output": "[0,1]"},
      {"input": "[3,2,4]\\n6", "output": "[1,2]"}
    ],
    "codeSnippets": {
      "python": "def twoSum(nums, target):\n    pass"
    },
    "referenceSolutions": {
      "python": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []"
    }
  }'
```
✅ Expected: 201, created problem object

### 2.3 Get Problem by ID
```bash
curl -X GET http://localhost:8080/problem/PROBLEM_ID_HERE
```
✅ Expected: 200, full problem object with testcases, examples, etc.

### 2.4 Update Problem (Owner Only)
```bash
curl -X PUT http://localhost:8080/problem/PROBLEM_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Two Sum (Updated)",
    "description": "Updated description...",
    "difficulty": "MEDIUM",
    "tags": ["array", "hash-table", "two-pointer"],
    "examples": [],
    "constraints": "...",
    "testcases": [],
    "codeSnippets": {},
    "referenceSolutions": {}
  }'
```
✅ Expected: 200, updated problem object

### 2.5 Delete Problem (Owner Only)
```bash
curl -X DELETE http://localhost:8080/problem/PROBLEM_ID_HERE \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE"
```
✅ Expected: 200, success message

### 2.6 Get Problems Solved by User
```bash
curl -X GET http://localhost:8080/problem/solved-problems \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE"
```
✅ Expected: 200, array of solved problems

---

## 3. PLAYLIST SERVICE TESTS

### 3.1 Create Playlist
```bash
curl -X POST http://localhost:8080/playlist/create-playlist \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "My Favorites",
    "description": "Problems I like"
  }'
```
✅ Expected: 201, created playlist

### 3.2 Get All Playlists
```bash
curl -X GET http://localhost:8080/playlist/get-all-playlists \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE"
```
✅ Expected: 200, array of user's playlists

### 3.3 Get Playlist Details
```bash
curl -X GET http://localhost:8080/playlist/PLAYLIST_ID_HERE \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE"
```
✅ Expected: 200, playlist with problems

### 3.4 Add Problems to Playlist
```bash
curl -X POST http://localhost:8080/playlist/PLAYLIST_ID_HERE/add-problems \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "problemIds": ["PROBLEM_ID_1", "PROBLEM_ID_2"]
  }'
```
✅ Expected: 201, updated playlist

### 3.5 Remove Problem from Playlist
```bash
curl -X DELETE http://localhost:8080/playlist/PLAYLIST_ID_HERE/remove-problems \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "problemIds": ["PROBLEM_ID_HERE"]
  }'
```
✅ Expected: 200, updated playlist

### 3.6 Delete Playlist
```bash
curl -X DELETE http://localhost:8080/playlist/PLAYLIST_ID_HERE \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE"
```
✅ Expected: 200, success message

---

## 4. CODE EXECUTION SERVICE TESTS

### 4.1 Run Code (Test Mode - No Submission)
```bash
curl -X POST http://localhost:8080/execute-code/execute \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "problemId": "PROBLEM_ID_HERE",
    "language": "python",
    "code": "def solution(nums, target):\n    return [0, 1]",
    "mode": "run",
    "stdin": "[2,7,11,15]\n9"
  }'
```
✅ Expected: 200, execution result with stdout/stderr

### 4.2 Submit Code (Submit Mode - Creates Submission)
```bash
curl -X POST http://localhost:8080/execute-code/execute \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "problemId": "PROBLEM_ID_HERE",
    "language": "python",
    "code": "def solution(nums, target):\n    return [0, 1]",
    "mode": "submit"
  }'
```
✅ Expected: 200, submission created + results for all testcases

---

## 5. SUBMISSION SERVICE TESTS

### 5.1 Get All Submissions by User
```bash
curl -X GET http://localhost:8080/submission/get-all-submissions \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE"
```
✅ Expected: 200, array of user's submissions

### 5.2 Get Submissions for a Problem
```bash
curl -X GET http://localhost:8080/submission/get-submissions-for-problem/PROBLEM_ID_HERE \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE"
```
✅ Expected: 200, array of submissions for that problem

### 5.3 Get All The Submissions for a Problem (Admin/Owner)
```bash
curl -X GET http://localhost:8080/submission/get-all-the-submissions-for-problem/PROBLEM_ID_HERE
```
✅ Expected: 200, array of all submissions for that problem

---

## Testing Checklist

**Auth Service:**
- [ ] Register new user
- [ ] Login with credentials
- [ ] Verify JWT cookie is set
- [ ] Access protected route with JWT
- [ ] Update profile
- [ ] Update password
- [ ] Logout (JWT cleared)

**Problem Service:**
- [ ] Get all problems (public, no auth)
- [ ] Create problem (requires auth)
- [ ] Get problem by ID with full details
- [ ] Update problem (owner only)
- [ ] Delete problem (owner only)
- [ ] Get problems solved by user

**Playlist Service:**
- [ ] Create playlist (requires auth)
- [ ] Get all playlists
- [ ] Get specific playlist details
- [ ] Add problems to playlist
- [ ] Remove problems from playlist
- [ ] Delete playlist

**Code Execution Service:**
- [ ] Run code (test mode)
- [ ] Submit code (creates submission)
- [ ] Verify testcase results

**Submission Service:**
- [ ] Get user submissions
- [ ] Get problem submissions
- [ ] Get all submissions for problem

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Missing/Invalid JWT | Add `-H "Cookie: jwt=TOKEN"` |
| 403 Forbidden | Not owner of resource | Use JWT of resource owner |
| 404 Not Found | Resource doesn't exist | Verify ID is correct |
| 500 Internal Error | Service error | Check backend logs |
| ECONNREFUSED | Backend not running | Start backend: `npm run dev` |

---

## Notes

- Save JWT tokens from login/register responses
- Replace `PROBLEM_ID_HERE`, `PLAYLIST_ID_HERE`, etc. with actual IDs
- All protected routes require JWT in cookie
- Services handle all error cases with proper status codes
