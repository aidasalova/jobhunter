# One More CV

A modern, local-first application designed to streamline and supercharge your job hunting process using AI.

## The Problem
Applying for jobs is a time-sink. Tailoring your CV and Cover Letter for every single application is exhausting, and keeping track of where you applied (and with which version of your CV) quickly turns into a disorganized mess of folders and spreadsheets. 

## The Solution
**One More CV** is an all-in-one platform that acts as your personal career assistant:
- **AI CV Tailoring:** Connect your Master Profile, paste a Job Description, and instantly generate a highly tailored CV and Cover Letter.
- **Application Tracker:** A built-in List system to track your application statuses (Draft, Applied, Interview, Offer, Rejected) along with the exact CV and Cover Letter you used for each role.
- **AI Interview Coach:** An AI agent that analyzes your CV against the Job Description to generate a custom Interview Stra tegy Brief and 10 highly probable, specific interview questions (with suggested STAR-method answers).
- **Google Doc Addon:** This project also features a companion Google Workspace Add-on built with Google Apps Script. It allows users to import their .json backup directly into a Google Doc sidebar and use Gemini to dynamically highlight and replace CV text on the page based on the job description. For detailed instructions, see Addon Readme.

## Architecture & Privacy (Zero-Liability)
Privacy is a core feature of this application. 

One More CV is built as a strictly **"Zero-Liability / Local-First"** application.
- **No Databases:** There is no centralized backend database (no PostgreSQL, no MongoDB, no SQLite).
- **100% Local Storage:** All of your data—your Master Profile, your job history, your tailored CVs, and your API keys—is stored entirely within your browser's native `localStorage`.
- **Zero Server Leaks:** When utilizing AI features, your data is passed in memory directly to the LLM provider. Nothing is ever cached, logged, or saved on our servers. You have complete ownership of your data.

## Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **AI Integration:** Google Gemini (REST API / SDK)
* **Storage:** Native Browser LocalStorage
* **Analytics:** Vercel Web Analytics
* **Deployment:** Vercel


## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aidasalova/jobhunter.git
   cd jobhunter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
4. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.
