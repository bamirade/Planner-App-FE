import React, { useEffect, useState } from "react";
import {
  Task,
  getTasks,
  updateTask,
  deleteTask,
} from "../../api/task";
import { Category, getCategories } from "../../api/category";
import EditTask from "./EditTask";

interface TasksListProps {
  onBack: () => void;
  handleShowNewTask: () => void;
}

const TasksList: React.FC<TasksListProps> = ({ onBack, handleShowNewTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks(selectedCategory);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(event.target.value);
    setSelectedCategory(categoryId);
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleUpdateTask = async (
    taskId: number,
    updatedData: Partial<Task>
  ) => {
    try {
      await updateTask(taskId, updatedData);
      setShowEditModal(false);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingTask(null);
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
            <li key={task.id}>
              {task.name}
              <button onClick={() => handleDeleteTask(task.id)}>
                Delete
              </button>
              <button onClick={() => handleEditTask(task)}>Edit</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleShowNewTask}>Create Task</button>
      <button onClick={onBack}>Back</button>

      {showEditModal && editingTask && (
        <EditTask
          task={editingTask}
          onUpdateTask={handleUpdateTask}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default TasksList;
