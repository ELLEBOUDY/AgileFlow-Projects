CREATE TABLE Users (
    user_id       INT            PRIMARY KEY AUTO_INCREMENT,
    username      VARCHAR(100)   NOT NULL UNIQUE,
    first_name    VARCHAR(100)   NOT NULL,
    last_name     VARCHAR(100)   NOT NULL,
    email         VARCHAR(255)   NOT NULL UNIQUE,
    password_hash VARCHAR(255)   NOT NULL,
    role          ENUM('admin', 'manager', 'member') NOT NULL DEFAULT 'member',
    created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE Projects (
    project_id    INT            PRIMARY KEY AUTO_INCREMENT,
    project_name  VARCHAR(200)   NOT NULL,
    description   TEXT,
    start_date    DATE,
    end_date      DATE,
    manager_id    INT            NOT NULL,          -- User who manages this project (1:M)
    created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
    CONSTRAINT fk_project_manager
        FOREIGN KEY (manager_id) REFERENCES Users(user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);
 
CREATE TABLE Project_Members (
    project_id    INT  NOT NULL,
    user_id       INT  NOT NULL,
    joined_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
    PRIMARY KEY (project_id, user_id),
 
    CONSTRAINT fk_pm_project
        FOREIGN KEY (project_id) REFERENCES Projects(project_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
 
    CONSTRAINT fk_pm_user
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
 
CREATE TABLE Tasks (
    task_id       INT            PRIMARY KEY AUTO_INCREMENT,
    task_title    VARCHAR(255)   NOT NULL,
    description   TEXT,
    priority      ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    status        ENUM('todo', 'in_progress', 'review', 'done') NOT NULL DEFAULT 'todo',
    deadline      DATE,
    project_id    INT            NOT NULL,          -- Task belongs to Project (contains)
    assigned_to   INT,                              -- Task assigned to User
    created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
    CONSTRAINT fk_task_project
        FOREIGN KEY (project_id) REFERENCES Projects(project_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
 
    CONSTRAINT fk_task_assignee
        FOREIGN KEY (assigned_to) REFERENCES Users(user_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);
 
CREATE TABLE Comments (
    comment_id    INT            PRIMARY KEY AUTO_INCREMENT,
    content       TEXT           NOT NULL,
    created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    task_id       INT            NOT NULL,          -- Comment belongs to Task (has)
    user_id       INT            NOT NULL,          -- Comment written by User (writes)
 
    CONSTRAINT fk_comment_task
        FOREIGN KEY (task_id) REFERENCES Tasks(task_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
 
    CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
 

CREATE TABLE Files (
    file_id       INT            PRIMARY KEY AUTO_INCREMENT,
    file_name     VARCHAR(255)   NOT NULL,
    file_path     VARCHAR(500)   NOT NULL,
    upload_date   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    task_id       INT            NOT NULL,          -- File belongs to Task (includes)
    uploaded_by   INT            NOT NULL,          -- File uploaded by User (uploads)
 
    CONSTRAINT fk_file_task
        FOREIGN KEY (task_id) REFERENCES Tasks(task_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
 
    CONSTRAINT fk_file_uploader
        FOREIGN KEY (uploaded_by) REFERENCES Users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
 

CREATE TABLE Notifications (
    notification_id INT           PRIMARY KEY AUTO_INCREMENT,
    message         TEXT          NOT NULL,
    is_read         BOOLEAN       NOT NULL DEFAULT FALSE,
    timestamp       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id         INT           NOT NULL,          -- Notification received by User (receives)
 
    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
 