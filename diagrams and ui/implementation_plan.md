# AgileFlow - Project Management System 🚀

## Implementation Plan

AgileFlow هو نظام إدارة مشاريع متكامل مصمم لمساعدة الفرق في تخطيط وتنظيم ومتابعة العمل. مستوحى من أدوات مثل Jira مع التركيز على البساطة والأداء وتجربة المستخدم.

---

## 📋 Project Summary (من تحليل المستندات)

### المستندات المُحللة:
1. **AgileFlow_Project_Documentt.pdf** - وصف المشروع والمتطلبات الوظيفية وغير الوظيفية
2. **AgileFlow_Phase2.pdf** - الـ API Documentation الكاملة (10 modules) + UML + ERD + Sequence Diagrams
3. **uiux PRD.pdf** - 29 شاشة Figma UI/UX (Dark Mode + Light Mode)

### Tech Stack المُتفق عليه:
| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Styling** | Vanilla CSS (CSS Variables + CSS Modules) |
| **State Management** | React Context + useReducer (أو Zustand) |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios |
| **Backend** | Django + Django REST Framework |
| **Database** | MySQL |
| **Auth** | JWT (Access + Refresh Tokens) |
| **File Storage** | Django Media Files (local) |

---

## 🎨 Design System (من تحليل الـ 29 Figma Screen)

### Color Palette

#### Dark Mode (Primary):
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0e1a` | Main background |
| `--bg-secondary` | `#111827` | Sidebar, cards |
| `--bg-tertiary` | `#1a2332` | Elevated surfaces |
| `--bg-card` | `#1e2a3a` | Card backgrounds |
| `--text-primary` | `#ffffff` | Primary text |
| `--text-secondary` | `#94a3b8` | Secondary text |
| `--accent-blue` | `#3b82f6` | Primary actions, active states |
| `--accent-green` | `#22c55e` | Success, active status |
| `--accent-orange` | `#f59e0b` | Warnings, on-hold |
| `--accent-red` | `#ef4444` | Errors, overdue |
| `--border` | `#1e293b` | Borders, dividers |

#### Light Mode:
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#f8fafc` | Main background |
| `--bg-secondary` | `#ffffff` | Sidebar, cards |
| `--bg-tertiary` | `#f1f5f9` | Elevated surfaces |
| `--text-primary` | `#0f172a` | Primary text |
| `--text-secondary` | `#64748b` | Secondary text |
| `--accent-blue` | `#1d4ed8` | Primary actions |

### Typography:
- **Font Family**: Inter (Google Fonts)
- **Headings**: 24-32px, font-weight 700
- **Body**: 14-16px, font-weight 400
- **Captions**: 12px, font-weight 500, uppercase, letter-spacing 0.05em

### Border Radius:
- **Cards**: 12px
- **Buttons**: 8px
- **Inputs**: 8px
- **Badges/Tags**: 16px (pill shape)
- **Avatars**: 50% (circle)

---

## 🏗️ Project Structure

### Frontend (React + TypeScript + Vite)

```
d:\phase2\frontend\
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/                    # Static assets (images, fonts)
│   ├── components/                # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Badge/
│   │   │   ├── Avatar/
│   │   │   ├── Table/
│   │   │   ├── Card/
│   │   │   ├── Dropdown/
│   │   │   ├── SearchBar/
│   │   │   ├── Pagination/
│   │   │   ├── Loader/
│   │   │   └── Toast/
│   │   ├── layout/
│   │   │   ├── Sidebar/
│   │   │   ├── TopBar/
│   │   │   ├── MainLayout/
│   │   │   └── AuthLayout/
│   │   └── features/
│   │       ├── dashboard/
│   │       ├── projects/
│   │       ├── tasks/
│   │       ├── team/
│   │       ├── files/
│   │       ├── reports/
│   │       ├── notifications/
│   │       ├── settings/
│   │       └── admin/
│   ├── contexts/                  # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   ├── hooks/                     # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useDebounce.ts
│   │   └── useTheme.ts
│   ├── pages/                     # Page-level components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   ├── TasksPage.tsx
│   │   ├── TaskBoardPage.tsx
│   │   ├── MyTasksPage.tsx
│   │   ├── TeamPage.tsx
│   │   ├── FilesPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── AdminConsolePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/                  # API service layer
│   │   ├── api.ts                 # Axios instance with interceptors
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── projectService.ts
│   │   ├── taskService.ts
│   │   ├── commentService.ts
│   │   ├── notificationService.ts
│   │   ├── fileService.ts
│   │   ├── reportService.ts
│   │   └── searchService.ts
│   ├── types/                     # TypeScript interfaces
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── project.ts
│   │   ├── task.ts
│   │   ├── comment.ts
│   │   ├── notification.ts
│   │   ├── file.ts
│   │   └── common.ts
│   ├── utils/                     # Utility functions
│   │   ├── formatDate.ts
│   │   ├── formatFileSize.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── styles/                    # Global styles
│   │   ├── index.css              # Design tokens + global styles
│   │   ├── variables.css          # CSS custom properties
│   │   ├── reset.css              # CSS reset
│   │   └── animations.css         # Keyframe animations
│   ├── App.tsx
│   ├── Router.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env
```

### Backend (Django + DRF)

```
d:\phase2\backend\
├── agileflow/                     # Project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── authentication/            # Auth module
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── permissions.py
│   ├── users/                     # User management
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── projects/                  # Project management
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── tasks/                     # Task management
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── comments/                  # Comments & collaboration
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── notifications/             # Notification system
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── signals.py
│   ├── files/                     # File management
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── reports/                   # Dashboard & reports
│   │   ├── views.py
│   │   └── urls.py
│   └── search/                    # Search & filter
│       ├── views.py
│       └── urls.py
├── manage.py
├── requirements.txt
└── .env
```

---

## 📡 API Modules (من الـ Phase2 Document)

### 1. Authentication & Authorization
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login (returns JWT) |
| POST | `/api/auth/logout/` | Logout |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| POST | `/api/auth/password/change/` | Change password |
| POST | `/api/auth/password/reset/` | Reset password via email |

### 2. User Management (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/` | List all users (paginated) |
| POST | `/api/users/` | Create user |
| GET/PUT/PATCH/DELETE | `/api/users/{id}/` | CRUD user |
| GET/PATCH | `/api/users/me/` | Own profile |
| GET | `/api/users/{id}/projects/` | User's projects |

### 3. Project Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/projects/` | List/Create projects |
| GET/PUT/PATCH/DELETE | `/api/projects/{id}/` | CRUD project |
| POST | `/api/projects/{id}/assign-manager/` | Assign PM |
| GET/POST | `/api/projects/{id}/members/` | Manage members |
| DELETE | `/api/projects/{id}/members/{uid}/` | Remove member |
| GET | `/api/projects/{id}/stats/` | Project statistics |

### 4. Task Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/projects/{pid}/tasks/` | List/Create tasks |
| GET/PUT/PATCH/DELETE | `/api/tasks/{id}/` | CRUD task |
| PATCH | `/api/tasks/{id}/status/` | Update status |
| POST | `/api/tasks/{id}/assign/` | Assign task |
| GET | `/api/tasks/my-tasks/` | My tasks |
| GET | `/api/projects/{pid}/tasks/board/` | Kanban board data |

### 5. Comments & Collaboration
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/tasks/{tid}/comments/` | List/Add comments |
| PUT/DELETE | `/api/comments/{id}/` | Update/Delete comment |
| POST | `/api/comments/{id}/reactions/` | Add reaction |

### 6. Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/` | List notifications |
| PATCH | `/api/notifications/{id}/read/` | Mark as read |
| POST | `/api/notifications/mark-all-read/` | Mark all read |
| DELETE | `/api/notifications/{id}/` | Delete notification |
| GET | `/api/notifications/unread-count/` | Unread count |

### 7. File Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks/{tid}/files/` | Upload file |
| GET | `/api/tasks/{tid}/files/` | List task files |
| GET | `/api/files/{id}/download/` | Download file |
| DELETE | `/api/files/{id}/` | Delete file |
| GET | `/api/projects/{pid}/files/` | All project files |

### 8. Dashboard & Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/` | Dashboard summary |
| GET | `/api/reports/projects/` | Project reports |
| GET | `/api/reports/tasks/` | Task reports |
| GET | `/api/reports/users/` | User performance |
| GET | `/api/reports/projects/{id}/timeline/` | Gantt data |
| GET | `/api/reports/export/` | Export CSV/XLSX |

### 9. Search & Filter
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search/` | Global search |
| GET | `/api/projects/{id}/tasks/filter/` | Filter tasks |
| GET | `/api/users/search/` | Search users |

---

## 📱 UI Screens (29 Figma Screens Analyzed)

كل شاشة ليها نسخة **Dark Mode** و **Light Mode**:

| # | Screen | Description | Key Features |
|---|--------|-------------|--------------|
| 1-2 | **Projects Page** | Grid/Table view للمشاريع | Stats cards, project cards with progress, filters |
| 3-4 | **Reports Dashboard** | تقارير وإحصائيات | Charts, performance audit table, project health |
| 5-6 | **Select Assignees Modal** | اختيار أعضاء للمهام | Search, checkboxes, avatars |
| 7 | **Register Page** | إنشاء حساب جديد | Full name, email, password, terms |
| 8-9 | **Admin Dashboard** | لوحة تحكم الأدمن | System stats, alerts, quick actions, activity feed |
| 10-13 | **Task Detail Panel** | تفاصيل المهمة | Subtasks, comments, attachments, slide-over panel |
| 11-12 | **Tasks Overview** | قائمة المهام | Table view, filters, pagination, status badges |
| 14-15 | **Team Directory** | إدارة الفريق | Members table, departments, status, filters |
| 16-17 | **Create Task Modal** | إنشاء مهمة جديدة | Rich text editor, subtasks, multi-assignee |
| 18-19 | **Settings/Profile** | الإعدادات والملف الشخصي | Personal info, workspace, security, theme toggle |
| 20 | **Admin Console** | إدارة النظام | User management, role distribution, audit log |
| 22 | **Files Management** | إدارة الملفات | Storage stats, file categories, file browser |
| 24 | **Login Page** | تسجيل الدخول | Email/password, SSO, remember me |
| 25-26 | **My Tasks** | مهامي الشخصية | Daily briefing, completion rate, active assignments |

---

## 🔄 Phased Execution Plan

### Phase 1: Foundation (الأساس) 🏗️
> **المدة المتوقعة: 3-4 أيام**

- [ ] Setup Vite + React + TypeScript project
- [ ] Setup Django project with MySQL
- [ ] Implement CSS Design System (variables, reset, animations)
- [ ] Build Layout components (Sidebar, TopBar, MainLayout, AuthLayout)
- [ ] Build common UI components (Button, Input, Modal, Badge, Avatar, Card, Table)
- [ ] Setup React Router with protected routes
- [ ] Setup Axios instance with JWT interceptors
- [ ] Implement ThemeContext (Dark/Light mode toggle)

### Phase 2: Authentication (المصادقة) 🔐
> **المدة المتوقعة: 2 أيام**

- [ ] Django: Custom User model with roles (Admin, Project Manager, Team Member)
- [ ] Django: JWT auth endpoints (register, login, logout, refresh, password)
- [ ] React: Login page (matching Figma screen 24)
- [ ] React: Register page (matching Figma screen 7)
- [ ] React: AuthContext + useAuth hook
- [ ] React: Protected routes + role-based access

### Phase 3: Dashboard (لوحة التحكم) 📊
> **المدة المتوقعة: 2 أيام**

- [ ] Django: Dashboard API endpoint
- [ ] React: System Control Panel (Admin view - screens 8-9)
- [ ] Stats cards (Total Projects, Active Users, Uptime, Storage)
- [ ] Critical Alerts section
- [ ] Quick Actions grid
- [ ] Active Projects Summary table
- [ ] Recent Activity feed

### Phase 4: Project Management (إدارة المشاريع) 📋
> **المدة المتوقعة: 3 أيام**

- [ ] Django: Project model + CRUD APIs
- [ ] Django: Project membership + manager assignment
- [ ] React: Projects page - Grid view (screens 1-2)
- [ ] React: Projects page - Table view
- [ ] Project cards with progress bars
- [ ] Filter bar (Status, Date, PM)
- [ ] Create/Edit project modal
- [ ] Project detail page with stats

### Phase 5: Task Management (إدارة المهام) ✅
> **المدة المتوقعة: 4 أيام**

- [ ] Django: Task model + CRUD APIs
- [ ] Django: Task status workflow (todo → in_progress → review → done)
- [ ] Django: Kanban board API
- [ ] React: Tasks Overview page - Table view (screens 11-12)
- [ ] React: Task Board page - Kanban (drag & drop)
- [ ] React: My Tasks page (screens 25-26)
- [ ] React: Create Task modal (screens 16-17)
- [ ] React: Task Detail slide-over panel (screens 10-13)
- [ ] Subtasks management
- [ ] Select Assignees modal (screens 5-6)

### Phase 6: Team & Collaboration (الفريق والتعاون) 👥
> **المدة المتوقعة: 2 أيام**

- [ ] Django: User management APIs
- [ ] Django: Comments + Reactions APIs
- [ ] React: Team Directory page (screens 14-15)
- [ ] React: Add Member modal
- [ ] React: Comments section in Task Detail
- [ ] Reactions on comments

### Phase 7: Files & Notifications (الملفات والإشعارات) 📁🔔
> **المدة المتوقعة: 2 أيام**

- [ ] Django: File upload/download APIs
- [ ] Django: Notification system + signals
- [ ] React: Files Management page (screen 22)
- [ ] React: Notification dropdown in TopBar
- [ ] React: File attachments in Task Detail
- [ ] Upload with drag & drop

### Phase 8: Reports & Settings (التقارير والإعدادات) 📈⚙️
> **المدة المتوقعة: 2 أيام**

- [ ] Django: Reports APIs
- [ ] Django: Export (CSV/XLSX)
- [ ] React: Reports Dashboard (screens 3-4)
- [ ] Charts (Task Completion Trends, Project Health)
- [ ] Performance audit table
- [ ] React: Settings/Profile page (screens 18-19)
- [ ] Theme toggle (Dark/Light mode)

### Phase 9: Admin & Search (الإدارة والبحث) 🔍
> **المدة المتوقعة: 2 أيام**

- [ ] Django: Admin-only APIs
- [ ] Django: Global search API
- [ ] React: Admin Console page (screen 20)
- [ ] User management table
- [ ] Role distribution chart
- [ ] System audit log
- [ ] React: Global search in TopBar
- [ ] Advanced task filtering

### Phase 10: Polish & Deploy (التلميع والنشر) ✨
> **المدة المتوقعة: 2 أيام**

- [ ] Responsive design adjustments
- [ ] Micro-animations & transitions
- [ ] Error handling & loading states
- [ ] Performance optimization
- [ ] Testing
- [ ] Documentation

---

## User Review Required

> [!IMPORTANT]
> **الخطة دي مبنية على تحليل كامل للمستندات الـ 3 والـ 29 شاشة Figma.**
> محتاج موافقتك عشان أبدأ التنفيذ.

> [!WARNING]
> **بخصوص الـ Backend Django:** المشروع ده كبير. هنبدأ بالـ Frontend الأول (React) مع mock data، وبعدين نعمل الـ Backend ونربطهم. ده أسرع approach وهيخليك تشوف نتيجة بسرعة. هل ده مناسب ليك؟

## Open Questions

1. **هل عاوز نبدأ بالـ Frontend الأول مع mock data ولا Backend و Frontend مع بعض؟**
2. **هل عاوز charts library معينة؟** (أنا هستخدم Recharts - خفيفة ومتوافقة مع React)
3. **هل عاوز drag & drop library معينة للـ Kanban Board؟** (أنا هستخدم @dnd-kit)
4. **هل عاوز Rich Text Editor للـ task descriptions؟** (ممكن نستخدم TipTap أو نخليها textarea بسيطة)
5. **هل الـ Figma designs بتاعتك هي اللي لازم نمشي عليها بالظبط ولا ممكن نحسن فيها؟**
6. **هل عاوز Zustand للـ state management ولا React Context كافية؟**

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify no TypeScript errors
- Run `python manage.py test` for Django unit tests
- Browser testing for all screens

### Manual Verification
- Visual comparison with Figma screens
- Test all CRUD operations
- Test role-based access control
- Test dark/light mode toggle
- Test responsive design on different viewports
