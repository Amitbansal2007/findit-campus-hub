# FindIt Campus Hub – Campus Lost & Found

FindIt Campus Hub is a web-based lost-and-found platform designed to help college students report lost belongings, report found items, and search for missing belongings through a centralized system.
## Live Website

https://findit-campus-igodw06q5-amit-kr.vercel.app
## Project Objectives

- Provide a centralized platform for lost-and-found reports.
- Allow students to report lost and found belongings.
- Help users search and discover relevant item reports.
- Provide an AI-powered assistant to answer lost-and-found queries.
- Make the platform accessible through a responsive interface.

## Features

- User registration and login.
- Report lost and found items.
- Browse and search item reports.
- Item detail pages.
- Upload and display item photographs.
- Supabase database integration.
- AI chatbot for lost-and-found assistance.
- Responsive user interface.

## Technologies Used

| Category | Technology |
|---|---|
| Frontend | React 19, TypeScript |
| Framework | TanStack Start |
| Routing | TanStack Router |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend and Database | Supabase |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| AI Provider | Groq |
| AI Model | Qwen 3.8 27B (`qwen/qwen3.8-27b`) |
| AI SDK | Groq SDK |

## AI Tools Used During Development

- **Lovable:** Used to generate the initial website frontend and project structure.
- **ChatGPT:** Used for code debugging, Supabase and Groq API integration guidance, prompt refinement, and chatbot testing.
- **Google Gemini:** Used to review the project, suggest chatbot test cases, and identify possible improvements related to security and reliability.

## Project Documentation

Additional project documentation is available in the `docs` folder:

- `initial-prompt.md` – Original prompt used to generate the initial website.
- `prompt-engineering.md` – AI tools and prompt engineering documentation.
- `test-results.md` – Chatbot testing results.

## Installation and Setup

### Prerequisites

- Node.js
- npm
- Supabase project credentials
- Groq API key

### Steps

1. Clone the repository:

```bash
git clone https://github.com/Amitbansal2007/findit-campus-hub.git
```

2. Open the project directory:

```bash
cd findit-campus-hub
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the project root and add these variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_PROJECT_ID`
- `GROQ_API_KEY`

Use your own project credentials. Never commit the `.env` file or expose secret API keys.

**Important:** Never upload API keys, passwords or other secrets to GitHub.

5. Start the development server:

```bash
npm run dev
```

6. Open the local URL displayed in your terminal.

## Testing

The AI chatbot was tested with different queries involving:

- Lost and found item searches.
- Spelling mistakes.
- Location-based searches.
- Queries with no matching reports.

Refer to `docs/test-results.md` for the recorded test cases and outcomes.

## Future Improvements

- Improve semantic item matching.
- Improve location-based search accuracy.
- Add image-based item recognition.
- Enhance chatbot security and error handling.
- Add more testing for different user scenarios.

## Repository

[FindIt Campus Hub – GitHub](https://github.com/Amitbansal2007/findit-campus-hub)

## Project Purpose

This project demonstrates how web technologies, database integration and AI-assisted development can be used to address a practical campus problem.