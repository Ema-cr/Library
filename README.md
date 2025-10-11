
# ABookalypse Library

## Requirements
- Node.js >= 18.x
- npm >= 9.x
- MongoDB (local or Atlas)

## Installation
1. Clone the repository:
	 ```sh
	 git clone <https://github.com/Ema-cr/Library.git>
	 cd Library
	 ```
2. Install dependencies:
	 ```sh
	 npm install
	 ```

## Environment Variables (.env)
Create a `.env` file in the root directory with:
```
MONGODB_URI= ""
```

## Running the Project
- Start the development server:
	```sh
	npm run dev
	```
- The app will be available at `http://localhost:3000`

## Folder Structure (Brief)
```
src/
	components/      # Reusable UI components
	database/        # Mongoose models
	lib/             # DB connection
	pages/           # Next.js pages (API, dashboard, login, etc)
	services/        # API service functions
	styles/          # Global styles
	utils/           # Utility functions (auth, toast)
```

## Login Security Notes
- Login uses localStorage to store session data (`sessionUser`).
- Protected pages use a custom hook (`useAuth`) to redirect unauthenticated users to `/login`.

## Useful Commands
- `npm run dev` — Start development server

## Useful dependencies maybe you need 
- `npm install mongoose` - Mongoose (MongoDB Object Data Modeling library).
- `npm install axios` - Axios (A promise-based HTTP client for the browser and node.js).
- `npm install react-toastify` - React-Toastify (A library to add simple notification toasts to a React app).
- `npm install @headlessui/react` - Headless UI (A set of completely unstyled, accessible UI components for React).
---

For any issues, please open an issue or contact me.

