import React, { useEffect, useState } from "react";
import { Task, getTasks } from "../../api/task";
import { Category, getCategories } from "../../api/category";

interface TasksListProps {
  onBack: () => void;
  handleShowNewTask: () => void;
}

const TasksList: React.FC<TasksListProps> = ({ onBack, handleShowNewTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchTasksAndCategories = async () => {
      try {
        const fetchedTasks = await getTasks(selectedCategory);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasksAndCategories();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(event.target.value);
    setSelectedCategory(categoryId);
  };

  return (
    <div>
      <h2>Tasks</h2>
      <select value={selectedCategory || ""} onChange={handleCategoryChange}>
        <option value="">All</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
      )}
      <button onClick={handleShowNewTask}>Create Task</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default TasksList;
