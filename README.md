

## File Structure

### Backend (Node.js, Express)

#### `index.js`
- Initializes the Express server.
- Configures middleware (CORS, JSON parsing, cookie handling).
- Imports and registers authentication, chat, and user routes.
- Listens on port 3000.

#### Routes
- **`authRoute.js`**: Manages Google OAuth authentication and logout. Handles token storage via cookies.
- **`chatRoute.js`**: Handles AI-generated responses using Google Gemini API. Requires an access token for authorization.
- **`userRoute.js`**: Fetches user profile details from Google using an access token.

#### Middleware
- **`authMiddleware.js`**: Verifies access tokens via Google’s OAuth2 API. Ensures only authenticated users can access protected routes.

### Frontend (Vite + React)

#### `App.jsx`
- Manages user login/logout.
- Sends chat messages to the backend and displays AI responses.
- Maintains chat history in state.

## API Endpoints

### Authentication (`authRoute.js`)

| Method | Endpoint       | Description                          | Auth Required |
|--------|--------------|--------------------------------------|--------------|
| GET    | `/auth`       | Redirects user to Google OAuth page | ❌           |
| GET    | `/oauthcallback` | Handles OAuth callback and stores token | ❌           |
| GET    | `/logout`    | Revokes token and clears cookies    | ✅           |

### Chat (`chatRoute.js`)

| Method | Endpoint | Description                                      | Auth Required |
|--------|---------|--------------------------------------------------|--------------|
| POST   | `/chat` | Sends a prompt to Google Gemini AI and returns a response | ✅           |

### User (`userRoute.js`)

| Method | Endpoint  | Description                                    | Auth Required |
|--------|----------|------------------------------------------------|--------------|
| GET    | `/api`   | Fetches the authenticated user's profile from Google | ✅           |

## How to Create Google OAuth Clients

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click "Select a Project" → "New Project" → Enter a project name.

### Step 2: Set Up OAuth Consent Screen
1. Navigate to APIs & Services → OAuth Consent Screen.
2. Choose **External** (for public apps).
3. Fill in the required details and add the following scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

### Step 3: Create OAuth Credentials
1. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**.
2. Select **Web Application** and configure the redirect URI:
   - **Authorized JavaScript Origins**: `http://localhost:5173`
   - **Authorized Redirect URI**: `http://localhost:3000/oauthcallback`
3. Click **Create**, and note down the **Client ID** and **Client Secret**.

### Step 4: Configure the Server
Replace the placeholders in `authRoute.js`:
```js
const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const REDIRECT_URL = "http://localhost:3000/oauthcallback";
```

## Setup Instructions

### Backend Setup
```sh
# Install dependencies
npm install

# Start the backend
node index.js
```

### Frontend Setup (Vite)
```sh
# Navigate to frontend project folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend should now be running at `http://localhost:5173`.

## Google Gemini API Key
To use Google Gemini AI, you need an API key:
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Navigate to **API Keys** and create a new API key.
4. Copy the API key and replace it in `chatRoute.js`:
```js
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
