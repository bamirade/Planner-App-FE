import React, { useState, useEffect } from "react";
import { createTask, Task } from "../../api/task";
import { getCategories, createCategory, Category } from "../../api/category";

interface CreateTaskProps {
  onBack: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onBack }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
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

  const handleCreateTask = async () => {
    if (category.trim() === "") {
      alert("Category is required");
      return;
    }

    let categoryId: number | undefined;

    const existingCategory = categories.find(
      (cat) => cat.name.toLowerCase() === category.toLowerCase()
    );

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const newCategory = await createCategory({ name: category });
      categoryId = newCategory.id;
      setCategories([...categories, newCategory]);
    }

    const taskData: Partial<Task> = {
      name,
      description,
      due_date: dueDate,
      category_id: categoryId,
    };

    const createdTask = await createTask(taskData);
    console.log("Created task:", createdTask);

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
  };

  const handleCancelAddCategory = () => {
    setIsAddingCategory(false);
    setCategory("");
  };

  return (
    <div>
      <h2>Create Task</h2>
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
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddCategory}>+</button>
          </div>
        )}
      </div>
      <button onClick={handleCreateTask}>Create Task</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default CreateTask;
