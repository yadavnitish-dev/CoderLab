# AlgoPrep API Documentation

All endpoints are prefixed with `/api/v1`. Authentication is handled via a `jwt` cookie.

## 1. Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create a new user account | No |
| POST | `/login` | Authenticate and receive a JWT cookie | No |
| POST | `/logout` | Clear the JWT cookie | Yes |
| GET | `/check` | Verify current session and return user data | Yes |
| PUT | `/update-profile` | Update user name or image | Yes |
| PUT | `/update-password` | Update account password | Yes |

---

## 2. Problems (`/problems`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/get-all-problems` | List all problems (paginated) | No |
| GET | `/get-problem/:id` | Fetch details of a specific problem | No |
| POST | `/create-problem` | Create a new problem | Admin Only |
| PUT | `/update-problem/:id` | Update existing problem metadata | Admin Only |
| DELETE | `/delete-problem/:id` | Delete a problem | Admin Only |
| GET | `/get-solved-problems` | List problems solved by current user | Yes |

---

## 3. Playlists (`/playlist`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all playlists for the current user | Yes |
| POST | `/create-playlist` | Create a new playlist | Yes |
| GET | `/:playlistId` | Get playlist details and problem list | Yes |
| POST | `/:playlistId/add-problem` | Add problems to a playlist | Yes |
| DELETE | `/:playlistId/remove-problem` | Remove problems from a playlist | Yes |
| DELETE | `/:playlistId` | Delete a playlist | Yes |

---

## 4. Submissions (`/submission`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/get-all-submissions` | List all submissions by current user | Yes |
| GET | `/get-submission/:problemId` | List submissions for a specific problem | Yes |
| GET | `/get-submissions-count/:problemId` | Get total submission count for a problem | Yes |

---

## 5. Code Execution (`/execute-code`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Execute or Submit code against test cases | Yes |

**Payload:**
```json
{
  "sourceCode": "string",
  "language": "string",
  "problemId": "string",
  "mode": "run" | "submit"
}
```
