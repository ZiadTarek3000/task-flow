import { fetchTasksFromApi } from '@/lib/task-api'
import { TaskList } from '@/components/TaskList'

export async function StreamedTaskList() {
  const tasks = await fetchTasksFromApi({ slow: true })

  return <TaskList tasks={tasks} />
}
