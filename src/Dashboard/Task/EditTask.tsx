import React, { useState, useEffect } from "react";
import { Task, updateTask } from "../../api/task";
import { getCategories, createCategory, Category } from "../../api/category";

interface EditTaskProps {
  task: Task;
  onUpdateTask: (taskId: number, updatedData: Partial<Task>) => void;
  onCancel: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({
  task,
  onUpdateTask,
  onCancel,
}) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.due_date);
  const [category, setCategory] = useState(task.category_id.toString());
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

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

  const handleUpdateTask = async () => {
    if (category.trim() === "") {
      alert("Category is required");
      return;
    }

    let categoryId: number | undefined;

    const existingCategory = categories.find(
      (cat) => cat.id.toString() === category
    );

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const newCategory = await createCategory({ name: category });
      categoryId = newCategory.id;
      setCategories([...categories, newCategory]);
    }

    const updatedTaskData: Partial<Task> = {
      name,
      description,
      due_date: dueDate,
      category_id: categoryId,
    };

    onUpdateTask(task.id, updatedTaskData);

    setName("");
    setDescription("");
    setDueDate("");
    setCategory("");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const handleAddCategory = () => {
    setIsAddingCategory(true);
    setCategory("");
  };

  const handleCancelAddCategory = () => {
    setIsAddingCategory(false);
    setCategory("");
  };

  return (
    <div>
      <h2>Edit Task</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label>Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div>
        <label>Category:</label>
        {isAddingCategory ? (
          <div>
            <input
              type="text"
              value={category}
              onChange={handleCategoryChange}
            />
            <button onClick={handleCancelAddCategory}>-</button>
          </div>
        ) : (
          <div>
            <select value={category} onChange={handleCategoryChange}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddCategory}>+</button>
          </div>
        )}
      </div>
      <button onClick={handleUpdateTask}>Update Task</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditTask;
