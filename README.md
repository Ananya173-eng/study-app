# AI Study & Productivity Hub

A responsive, high-performance web application designed for students and self-learners to manage study notes, tasks, deadlines, and learning materials with modular AI assistance. Built with Next.js 15, TypeScript, Tailwind CSS, and Lucide Icons.

---

## 🚀 Key Features

### 1. VS Code-Style Explorer & Activity Bar
- **Activity Bar (Left Rail)**: Fast switching between Dashboard, Notes, Tasks, Deadlines, PDF Materials, AI Tools, Settings, and Profile.
- **Collapsible File Explorer**:
  - `📁 STUDY NOTES` (with item count, quick "+ New Note" action, file tree)
  - `📁 TASKS` (with pending count, "+ New Task" action)
  - `📁 DEADLINES & PROGRESS` (live velocity bar, study streak status)
  - `📁 LEARNING MATERIALS` (uploaded PDFs with file size badges, "+ Upload PDF" action)
  - `📁 AI ASSISTANT & TOOLS` (Summarizer, Quiz Generator, Flashcards, Study Assistant RAG, Task Planner)
- **Explorer Filter**: Real-time search across the entire file tree.
- **Shortcut**: `Ctrl+B` toggles the explorer sidebar.

---

### 2. PDF & Learning Material Management (Acceptance Criteria Compliant)
- **Local Computer Upload**: Drag & drop or browse local files.
- **Permitted File Size Limit**: Supports up to **70 MB** (configurable between 50–70 MB).
- **Comprehensive Situation Alerts**:
  - ⚠️ **PDF Size Exceeded**: Displays an alert if the selected file exceeds 70 MB.
  - ❌ **PDF Format Invalid**: Displays an alert if an unsupported file type or invalid PDF is chosen.
  - 🔁 **PDF Already Uploaded**: Duplicate detection warns if a document with the same name already exists in the library.
  - ✅ **Upload Success / Failure**: Clear notifications when upload succeeds or fails.
- **Text Extraction & Indexing**: PDF content is parsed and indexed for immediate AI summarization, quiz generation, flashcards, and RAG search.
- **Document Preview Modal**: Inspect raw extracted text and metadata.

---

### 3. Study Notes Management
- **Create, Edit, Delete, Categorize**: Rich note authoring with Markdown support.
- **Search and Filter Toolbar**:
  - Real-time keyword search across note titles, tags, and content.
  - Dedicated **Filter** button revealing Category, Priority, and Tag filters.
  - Active filter badges and one-click filter reset.
- **Delete Confirmation Pop-up**:
  - Clicking delete opens a confirmation modal with **Confirm Delete** and **Cancel**.
  - Clicking Cancel leaves the note unchanged.
  - Clicking Confirm Delete removes the item and updates the list immediately.

---

### 4. Tasks, Deadlines & Progress Tracker
- **Kanban Board & List Views**: Organize tasks across *To Do*, *In Progress*, and *Completed*.
- **Urgency Alerts**: Color-coded badges for **Overdue**, **Due Today**, and **Upcoming**.
- **Delete Confirmation Pop-up**: Protected deletion matching acceptance criteria.
- **Deadlines & Progress Analytics**:
  - Overall completion velocity with progress bar.
  - Chronological deadline timeline (Overdue, Today, Upcoming).
  - 7-day study streak tracking.
  - Weekly study hours progress bar against target goals.
  - Topic/Subject mastery breakdown.

---

### 5. Modular AI Academic Suite
- 📄 **AI Summarizer**:
  - Condense notes, PDFs, or custom text.
  - 4 Formats: *Bullet Points*, *Executive Brief*, *Key Concepts*, *Study Guide*.
  - Depth control: *Short*, *Medium*, *Detailed*.
  - 1-click **"Save as Study Note"** and **"Copy to Clipboard"**.
- 🎯 **AI Quiz Generator**:
  - Generates Multiple Choice Questions (MCQs) with 4 options and detailed explanations.
  - Difficulty selection (*Easy*, *Medium*, *Hard*) and question count.
  - Interactive quiz taking mode with instant feedback, scoring percentage, and retake option.
- 🗂️ **AI Flashcards**:
  - Generates flashcards with key concepts and definitions.
  - 3D interactive flip animation with front (term) and back (explanation).
  - Spaced recall tracking: *Mark as Mastered*, *Deck Shuffle*, and progress bar.
- 🤖 **AI Study Assistant (RAG Chat)**:
  - Ask questions about your study materials using Retrieval-Augmented Generation.
  - Grounded answers with exact citations and document snippets.
  - Filter knowledge scope to all documents or a single specific PDF.
- 📅 **AI Task Planner**:
  - Decomposes high-level syllabus goals into structured daily milestones.
  - **1-Click "Add to My Tasks"**: Directly imports planned milestones into your Task Tracker with deadlines and priorities!

---

### 6. Authentication & Settings
- **User Authentication**: Sign In, Register, Profile Management, and **1-Click Student Demo Account**.
- **AI Settings**:
  - Works 100% out of the box with built-in intelligent academic generation.
  - Option to configure personal Gemini or OpenAI API keys in the Settings modal.
  - Demo data reset button to restore initial seeds anytime.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with VS Code Dark Theme palette
- **Icons**: Lucide React
- **Persistence**: Browser LocalStorage with SSR safety + Next.js API Routes (`/api/ai`)
- **Execution Port**: `3001` (configured to prevent port collisions)

---

## 📦 Setup & Running Locally

1. **Clone or navigate to the project directory**:
   \`\`\`bash
   cd "c:/Users/HP/OneDrive/Desktop/Study APP"
   \`\`\`

2. **Install dependencies** (already installed):
   \`\`\`bash
   npm install
   \`\`\`

3. **Start Development Server**:
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will run at [http://localhost:3001](http://localhost:3001).

4. **Production Build & Run**:
   \`\`\`bash
   npm run build
   npm run start
   \`\`\`

---

## 🧪 Testing the Requirements

1. **Test Left Sidebar Explorer**:
   - Click the tree headers (*Study Notes*, *Tasks*, *Deadlines*, *Learning Materials*, *AI Tools*) to collapse/expand.
   - Press `Ctrl+B` or click the toggle icon on the Activity Bar to hide/show the Explorer.

2. **Test Search & Filter in Notes**:
   - Go to **Study Notes**, click the **Filter** button, filter by Category (e.g. *Computer Science* or *Biology*), Priority, or use the search bar.

3. **Test Delete Confirmation Pop-up**:
   - Click the trash icon on any Note, Task, or PDF.
   - Click **Cancel** -> the item remains intact.
   - Click **Confirm Delete** -> the item is deleted and the list updates instantly with a toast alert.

4. **Test PDF Upload & Alerts**:
   - Go to **Learning Materials**.
   - Try uploading a non-PDF file -> Alert: *"PDF Format Invalid"*.
   - Try uploading a file > 70 MB -> Alert: *"PDF Size Exceeded"*.
   - Try uploading a duplicate file with the same name -> Alert: *"PDF Already Uploaded"*.
   - Upload any valid PDF -> Alert: *"PDF Upload Successful"*, and the document is indexed for AI tools.

5. **Test AI Features**:
   - Click **AI Summarizer** on any note or PDF to synthesize bullet points.
   - Click **AI Quiz Generator** to take interactive MCQs with grading.
   - Click **AI Flashcards** to flip 3D cards and track mastery.
   - Click **AI Study Assistant** to ask questions with grounded citations.
   - Click **AI Task Planner** to convert a goal into tasks, then click **"Add to My Tasks"** to see them in your Task Tracker!
