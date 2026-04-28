# AgileFlow 🚀 - Premium Project Management Suite

**AgileFlow** is a sophisticated, high-performance Agile Project Management application designed to empower teams with a seamless, visual, and highly interactive workflow. Built with the latest web technologies, it provides a premium experience that rivals industry-leading tools like Trello, Jira, and Asana.

Whether you are managing a small startup or a large-scale enterprise project, AgileFlow offers the clarity and speed you need to deliver high-quality results.

---

## 🌟 Key Features

### 1. Dynamic Dashboard & Analytics
- **Project Pulse**: A high-level overview of all active projects and their health.
- **Metric Tiles**: Instant visibility into total tasks, completed items, in-progress work, and overdue alerts.
- **Interactive Charts**: Visual representation of productivity trends and task distribution using Recharts.

### 2. Advanced Kanban Board
- **Drag-and-Drop Workflow**: Seamlessly move tasks between stages (To Do, In Progress, Review, Done) using `@dnd-kit`.
- **Status Persistence**: Real-time updates that reflect across the entire application state.
- **Visual Cues**: Color-coded priorities and tags for instant task identification.

### 3. Comprehensive Task Management
- **Detailed Task View**: Add descriptions, sub-tasks, and deadlines.
- **Priority Ranking**: Categorize tasks by urgency (Low, Medium, High, Urgent).
- **Filtered Views**: Easily find what you need with advanced search and filter capabilities.

### 4. Modern User Interface (UI/UX)
- **Glassmorphism & Sleek Design**: A stunning, modern interface that feels fast and responsive.
- **Native Dark Mode**: Beautifully crafted dark and light themes that respect system preferences.
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop screens.
- **Micro-animations**: Smooth transitions and hover effects for an engaging user experience.

---

## 🛠️ Tech Stack & Architecture

AgileFlow is built on a modern, scalable architecture designed for performance and maintainability.

### Frontend
- **React 19 (Vite)**: The core library for building the user interface, utilizing the latest concurrent features.
- **TypeScript**: Ensuring type safety and robust code across the entire application.
- **Tailwind CSS**: A utility-first CSS framework for rapid, premium UI development.
- **Lucide React**: A beautiful, consistent icon library.
- **Radix UI**: Accessible, headless UI primitives for high-quality components.

### State Management & Data
- **Redux Toolkit**: The industry standard for efficient state management.
- **Redux Persist**: Ensures your application state (like authentication and task data) survives page refreshes.
- **TanStack Query (React Query)**: Powerful asynchronous state management and data fetching.

### Forms & Validation
- **React Hook Form**: Performant, flexible, and extensible forms.
- **Zod**: TypeScript-first schema declaration and validation.

### Backend (Mock Environment)
- **JSON Server**: Provides a full fake REST API with zero coding, used for local development and testing.

---

## 🚀 Getting Started (Installation Guide)

Follow these steps to get a local copy of AgileFlow up and running on your machine.

### 1. Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes with Node.js)

### 2. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/ELLEBOUDY/AgileFlow-Projects.git
cd AgileFlow-Projects
```

### 3. Install All Dependencies
**Important Note:** You do **not** need to install Tailwind, Redux, or the Router manually. All necessary libraries are listed in the `package.json` and will be installed automatically by npm.

Navigate to the `frontend` directory and run:
```bash
cd frontend
npm install
```
This command will fetch and install:
- **Tailwind CSS** (for styling)
- **React Router** (for navigation)
- **Redux Toolkit** (for state)
- **Lucide Icons**, **Zod**, **Radix UI**, and everything else needed to run the project.

### 4. Running the Project

To see the project in action, you need to start two things: the **Mock Backend** and the **Frontend Development Server**.

#### Step A: Start the Mock API Server
In your current terminal (inside the `frontend` folder):
```bash
npm run server
```
*This starts the JSON Server on `http://localhost:5000` using your `db.json` file.*

#### Step B: Start the Frontend Development Server
Open a **new** terminal tab, navigate back to the `frontend` folder, and run:
```bash
npm run dev
```
*The application will now be available at `http://localhost:5173` (or the URL displayed in your terminal).*

---

## 📁 Project Structure Explained

```text
AgileFlow-Project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/    # Shared layouts (Navigation, Sidebars)
│   │   │   └── ui/        # Reusable primitive UI components (Buttons, Cards, Inputs)
│   │   ├── pages/         # Page-level components (Dashboard, Tasks, Auth)
│   │   ├── lib/           # Utility functions and Tailwind configurations
│   │   ├── store/         # Redux slices and store configuration
│   │   ├── services/      # API communication logic (Axios/Fetch)
│   │   └── hooks/         # Custom React hooks
│   ├── public/            # Static assets (Images, SVGs)
│   ├── db.json            # Your local database (JSON format)
│   └── package.json       # Project configuration and dependency list
├── .gitignore             # Files to be ignored by Git
└── README.md              # Main project documentation
```

---

## 👥 Authors & Contributors

This project is actively maintained and developed by:

- **Mahmoud Elleboudy (ELLEBOUDY)** - *Lead Developer & Architect* - [GitHub Profile](https://github.com/ELLEBOUDY)

We welcome contributions! If you have ideas for new features or find a bug, feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software for personal or commercial use.

---

*AgileFlow - Manage your flow, deliver your best.*
