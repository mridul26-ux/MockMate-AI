# AI Mock Interview Platform

An advanced mock interview platform powered by AI. It generates highly tailored technical and behavioral questions based on your job role, experience level, and resume. The platform listens to your verbal responses and evaluates your code in real-time, providing actionable feedback to help you master your next interview.

## Features

- **Tailored Questions**: Dynamically generated based on your desired role, experience level, and uploaded resume.
- **Voice Recognition**: Speak your answers naturally. The platform analyzes your verbal responses instantly and accurately.
- **Detailed Feedback**: Get scored on technical accuracy and communication skills, with actionable insights for improvement.
- **Coding Challenges**: Built-in code editor for technical interviews.

## Getting Started

First, ensure you have set up your `.env.local` file with the required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `MONGODB_URI`
- `GEMINI_API_KEY`

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
