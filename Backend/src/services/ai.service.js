import { GoogleGenAI } from "@google/genai";
import z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

const generateInterviewReport = async ({
  resume,
  selfDescription,
  jobDescription,
}) => {
  const prompt = `
You are an expert technical interviewer.

Analyze the candidate profile and return ONLY valid JSON.

{
  "title": "",
  "matchScore": 0,
  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "skillGaps": [
    {
      "skill": "",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": ["", ""]
    }
  ]
}

Requirements:
- Extract the job title from the job description.
- Generate exactly 5 technical questions.
- Generate exactly 5 behavioral questions.
- Generate at least 5 skill gaps.
- Generate a 7-day preparation plan.
- Match score should be between 0 and 100.
- Do not return empty arrays.
- Return ONLY valid JSON.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
};
const generatePdfFromHtml = async (htmlContent) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "10mm",
      bottom: "10mm",
      left: "10mm",
      right: "10mm",
    },
  });

  await browser.close();

  return pdfBuffer;
};

const generateResumePdf = async ({
  resume,
  selfDescription,
  jobDescription,
}) => {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.

         The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

  //   const prompt = `
  // You are an expert Resume Writer, Career Coach, ATS Resume Optimizer, and Technical Recruiter with 15+ years of experience.

  // Your task is to generate a highly professional, ATS-friendly resume tailored specifically for the provided Job Description.

  // Candidate Resume:
  // ${resume}

  // Candidate Self Description:
  // ${selfDescription}

  // Job Description:
  // ${jobDescription}

  // =========================
  // IMPORTANT OUTPUT FORMAT
  // =========================

  // Return ONLY a valid JSON object.

  // Example:

  // {
  //   "html": "<!DOCTYPE html>....complete html...."
  // }

  // Do NOT return markdown.
  // Do NOT return explanations.
  // Do NOT wrap inside \`\`\`.
  // Only return valid JSON.

  // =========================
  // GOAL
  // =========================

  // Generate a modern, professional resume that maximizes ATS score while remaining realistic and human-written.

  // The resume should feel like it was written by an experienced recruiter.

  // =========================
  // RULES
  // =========================

  // 1. Tailor the resume according to the Job Description.

  // 2. Rewrite experience bullets using strong action verbs.

  // 3. Quantify achievements wherever possible.

  // 4. Make every bullet concise and impactful.

  // 5. Remove duplicate information.

  // 6. Improve grammar and wording.

  // 7. Never invent:
  //    - Companies
  //    - Job Titles
  //    - Employment Dates
  //    - Education
  //    - Certifications
  //    - Projects
  //    - Achievements that cannot reasonably be inferred

  // 8. You MAY enhance existing project descriptions to better explain business impact.

  // 9. Resume should be 1–2 pages when converted to PDF.

  // 10. Use a clean, modern and ATS-friendly layout.

  // =========================
  // TECHNICAL SKILLS
  // =========================

  // Group skills exactly like this:

  // Technical Skills

  // Programming Languages
  // Frontend
  // Backend
  // Databases
  // Cloud
  // DevOps
  // Testing
  // AI & Automation
  // Tools

  // Example:

  // Programming Languages
  // JavaScript (ES6+), TypeScript

  // Frontend
  // React.js
  // Next.js
  // Redux Toolkit
  // Tailwind CSS
  // Material UI
  // Shadcn UI
  // HTML5
  // CSS3

  // Backend
  // Node.js
  // Express.js
  // REST APIs
  // JWT Authentication

  // Databases
  // MongoDB
  // MySQL
  // Mongoose

  // Cloud
  // AWS
  // Azure
  // Firebase

  // DevOps
  // Docker
  // CI/CD Pipelines
  // GitHub Actions

  // Testing
  // Jest
  // React Testing Library
  // Cypress

  // AI & Automation
  // OpenAI API
  // Prompt Engineering
  // AI Integrations

  // Tools
  // Git
  // GitHub
  // Postman
  // Vercel
  // Render
  // =========================
  // SKILL HIGHLIGHTING
  // =========================

  // Important technologies should be visually highlighted.

  // Whenever a technical skill appears anywhere in the resume, wrap it like this:

  // <span style="font-weight:600;color:#0f172a;background:#eef6ff;padding:2px 6px;border-radius:4px;">
  // React.js
  // </span>

  // Highlight:

  // React.js
  // Next.js
  // TypeScript
  // JavaScript
  // Redux Toolkit
  // Node.js
  // Express.js
  // MongoDB
  // MySQL
  // REST APIs
  // JWT
  // Docker
  // AWS
  // Azure
  // Firebase
  // Tailwind CSS
  // Material UI
  // Git
  // GitHub
  // CI/CD
  // Postman

  // Do NOT overuse highlighting.

  // Highlight only technologies and important keywords.
  // =========================
  // ADDING MISSING SKILLS
  // =========================

  // Your primary goal is to improve ATS compatibility.

  // If the Job Description contains important technologies that are NOT present in the candidate's resume, you MAY intelligently add them.

  // Examples:

  // React
  // → TypeScript
  // → Next.js

  // Node.js
  // → Docker
  // → CI/CD Pipelines
  // → PM2

  // MongoDB
  // → Mongoose
  // → Redis

  // REST APIs
  // → Swagger

  // Git
  // → GitHub Actions

  // React + Redux
  // → Redux Toolkit

  // Express
  // → JWT Authentication

  // Only add technologies that naturally complement the candidate's existing stack.

  // Never add completely unrelated technologies.

  // For example,

  // DO NOT add:

  // Kubernetes
  // Terraform
  // Apache Kafka
  // Go
  // Rust
  // Machine Learning

  // unless the candidate already has related experience.

  // Maximum additional skills:
  // 8

  // =========================
  // EXPERIENCE
  // =========================

  // Rewrite every bullet professionally.

  // Use this style:

  // • Developed reusable React components reducing development time by 30%.

  // • Integrated REST APIs improving application performance.

  // • Optimized frontend rendering resulting in faster page loads.

  // Do NOT create fake work experience.

  // =========================
  // PROJECTS
  // =========================

  // Projects should include

  // Project Name

  // Description

  // Business Impact

  // Technologies Used

  // Example

  // Job Portal

  // • Built a scalable MERN-based job portal supporting recruiter and candidate workflows.

  // • Implemented JWT authentication, role-based authorization and REST APIs.

  // • Developed responsive dashboards and optimized API performance.

  // Technologies:
  // React.js, Redux Toolkit, Node.js, Express.js, MongoDB, JWT, Tailwind CSS
  // =========================
  // ACHIEVEMENT HIGHLIGHTING
  // =========================

  // Highlight measurable achievements such as percentages, years, performance improvements, user counts, revenue, cost savings and metrics.

  // Example:

  // Developed reusable React components reducing development time by
  // <span style="font-weight:bold;color:#0b5ed7;">30%</span>.

  // Optimized page load speed by
  // <span style="font-weight:bold;color:#0b5ed7;">45%</span>.
  // =========================
  // PROFESSIONAL SUMMARY
  // =========================

  // This section is MANDATORY.

  // The HTML MUST always contain the following section exactly once:

  // <section>
  // <h2>Professional Summary</h2>
  // ...
  // </section>

  // Do NOT omit this section under any circumstances.

  // Generate a compelling 3–5 line summary that includes:

  // • Total years of experience
  // • Core technologies
  // • Domain expertise
  // • Problem-solving abilities
  // • Business impact
  // • ATS keywords from the Job Description

  // The heading MUST be exactly:

  // Professional Summary

  // =========================
  // HTML REQUIREMENTS
  // =========================

  // Return COMPLETE HTML.

  // Use semantic HTML.

  // Example sections

  // <header>

  // <section>

  // <h1>

  // <h2>

  // <ul>

  // <li>

  // Do NOT use tables for important content.

  // Use inline CSS only.

  // Page size should fit A4.

  // Use professional typography.

  // Use minimal colors.

  // Ensure excellent spacing.

  // Keep margins PDF-friendly.

  // =========================
  // FINAL CHECKLIST
  // =========================

  // ✓ ATS Friendly

  // ✓ Human sounding

  // ✓ Modern

  // ✓ Professional

  // ✓ Clean HTML

  // ✓ Puppeteer Compatible

  // ✓ Tailored to Job Description

  // ✓ Well grouped Technical Skills

  // ✓ Strong Experience Bullets

  // ✓ Professional Summary

  // ✓ Maximum 2 pages

  // Return ONLY the JSON object.
  // `;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
};

export { generateInterviewReport, generateResumePdf };
