# Tiny Tasks - Todo Application Specification

## Overview

Tiny Tasks is a personal todo application where users manage their private task lists through Internet Identity authentication.

## Authentication

- Users must authenticate with Internet Identity to access the application
- Each user has a completely private task list that only they can access
- The application uses InternetIdentityProvider component to wrap the root of the React application for proper Internet Identity integration

## Backend Data Storage

### User Data

- User display name (can be set and updated by the user)

### Task Data (per user)

- Title (required field)
- Due date
- Priority level stored as a string with values: "high", "medium", "low"
- Notes (optional field)
- Completion status (completed or uncompleted)

## Backend Operations

- Create new tasks for authenticated users with priority stored as string value
- Retrieve all tasks for authenticated users with priority returned as string value
- Update existing tasks (title, due date, priority, notes, completion status) with priority handled as string
- Update user display name
- No task deletion functionality

## Frontend Features

### Authentication Interface

- Sign in and sign out with Internet Identity
- Display current user authentication status
- Show user's display name when authenticated in "Signed in as" section
- Edit button in the "Signed in as" section to allow users to change their display name

### Task Management Interface

- Task list displaying all task fields (title, due date, priority, notes) for each task
- Uncompleted tasks displayed above completed tasks
- Visual distinction between completed and uncompleted tasks
- Expandable/collapsible notes section for each task
- Task creation form with validation for required fields and proper priority selection that saves the selected priority as string to backend
- Task editing form with validation and accurate priority display/modification
- Icon-only buttons to toggle creation and editing forms

### Visual Elements

- Priority badges displayed for all tasks with correct interpretation of backend string data:
  - "High" priority badge with red color (for "high" string value)
  - "Medium" priority badge with yellow color (for "medium" string value)
  - "Low" priority badge with blue color (for "low" string value)
- Priority badges are positioned directly under the task title in a horizontal row alongside the due date and notes indicator for clear visibility
- Priority badges accurately reflect the task's stored priority string value from backend with proper capitalization and correct color matching

### Task Organization

- Real-time search functionality by task title
- Local sorting options: due date, priority, title
- Priority sorting works correctly with High > Medium > Low ordering without causing application errors
- Sorting applied separately within uncompleted and completed task groups
- Clickable "Completed Tasks ({Task_Count})" header that toggles the visibility of completed tasks

### Footer

- Display "© 2025. Built with ☕️ using caffeine.ai"
