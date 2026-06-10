export type TaskStatus = "Pending" | "In Progress" | "Done"
export type TaskPriority = "Low" | "Medium" | "High"

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
}

export type User = {
  id: string
  name: string
  email: string
  // True when this is an anonymous guest session (instant access, no sign-in).
  isGuest?: boolean
}
