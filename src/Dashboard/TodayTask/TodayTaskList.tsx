import React, { useEffect, useState } from "react";
import { Task, getTasks, markTaskAsCompleted, updateTask } from "../../api/task";

const TodayTaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const todayTasks = tasks.filter((task) => task.due_date === today);

  const handleCompleteTask = async (taskId: number) => {
    try {
      const updatedTask = await markTaskAsCompleted(taskId);
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const handleUndoTask = async (taskId: number) => {
    try {
      const updatedTask = await updateTask(taskId, { is_completed: false });
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error undoing task completion:", error);
    }
  };

  return (
    <div>
      <h2>Today's Tasks</h2>
      {todayTasks.length === 0 ? (
        <p>No tasks for today.</p>
      ) : (
        <ul>
          {todayTasks.map((task) => (
            <li key={task.id}>
              {task.name}
              {task.is_completed ? (
                <button onClick={() => handleUndoTask(task.id)}>
                  Undo
                </button>
              ) : (
                <button onClick={() => handleCompleteTask(task.id)}>
                  Complete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodayTaskList;
