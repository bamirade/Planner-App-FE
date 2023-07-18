import React, { useEffect, useState } from "react";
import { Task, getTasks } from "../../api/task";

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

  return (
    <div>
      <h2>Today's Tasks</h2>
      {todayTasks.length === 0 ? (
        <p>No tasks for today.</p>
      ) : (
        <ul>
          {todayTasks.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodayTaskList;
