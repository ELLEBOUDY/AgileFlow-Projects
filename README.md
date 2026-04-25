# AgileFlow Projects 🚀

AgileFlow is a modern, high-performance Agile Project Management tool designed to streamline workflows, enhance team collaboration, and provide clear visibility into project progress. Built with a focus on speed, aesthetics, and usability, it offers a premium experience for managing tasks and projects.

## ✨ Features

- **Dynamic Dashboard**: Real-time overview of project health, task status, and team activity.
- **Kanban Board**: Interactive drag-and-drop interface for seamless task management across different stages (To Do, In Progress, Done).
- **Task Management**: Create, edit, and track tasks with detailed descriptions, priorities, and deadlines.
- **State Persistence**: Your data is saved locally and persists across sessions using Redux Persist.
- **Responsive Design**: Fully optimized for various screen sizes, from mobile to desktop.
- **Dark Mode Support**: Sleek, modern interface with native dark mode support.
- **Data Visualization**: Integrated charts and metrics using Recharts for better decision-making.

## 🛠️ Tech Stack

- **Core**: React 19 (Vite), TypeScript
- **State Management**: Redux Toolkit, React Redux, Redux Persist
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS, Lucide React (Icons), Radix UI (Accessible Components)
- **Forms & Validation**: React Hook Form, Zod
- **Backend (Mock)**: JSON Server
- **Transitions**: Framer Motion / CSS Animations

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ELLEBOUDY/AgileFlow-Projects.git
   cd AgileFlow-Projects
   ```

2. **Install dependencies:**
   Navigate to the frontend directory and install the required libraries:
   ```bash
   cd frontend
   npm install
   ```

### Running the Project

To start both the frontend and the mock backend server:

1. **Start the JSON Server (Mock API):**
   ```bash
   # In the frontend directory
   npm run server
   ```

2. **Start the Frontend Development Server:**
   ```bash
   # In a new terminal tab, within the frontend directory
   npm run dev
   ```

The application will be available at `http://localhost:5173` (or the port specified in your terminal).

## 📁 Project Structure

```text
AgileFlow-Project/
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   ├── lib/         # Utility functions and configurations
│   │   ├── store/       # Redux state management
│   │   └── hooks/       # Custom React hooks
│   ├── public/          # Static assets
│   ├── db.json          # Mock database for JSON Server
│   └── package.json     # Project dependencies and scripts
└── README.md            # Root documentation
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

Developed with ❤️ by [ELLEBOUDY](https://github.com/ELLEBOUDY)
