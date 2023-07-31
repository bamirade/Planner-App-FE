import React, { useState, useEffect } from "react";
import { createTask, Task } from "../../api/task";
import { getCategories, createCategory, Category } from "../../api/category";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Snackbar,
} from "@mui/material";

interface CreateTaskProps {
  onBack: () => void;
  onTaskCreate: () => void;
}

const getTimeFromDate = (dateTime: string) => {
  const dateObj = new Date(dateTime);
  dateObj.setHours(dateObj.getHours() + 8);
  return dateObj.toISOString().slice(11, 16);
};

const CreateTask: React.FC<CreateTaskProps> = ({ onBack, onTaskCreate  }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState<string | number>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [dueTime, setDueTime] = useState(getTimeFromDate(new Date().toISOString()));

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
    if (!category) {
      alert("Category is required");
      return;
    }

    let categoryId: number | undefined;

    const existingCategory = categories.find((cat) => cat.id === category);

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      try {
        const newCategory = await createCategory({ name: category.toString() });
        categoryId = newCategory.id;
        setCategories([...categories, newCategory]);
      } catch (error) {
        setSnackbarMessage("Error category already exists");
        setSnackbarOpen(true);
        return;
      }
    }

    const taskData: Partial<Task> = {
      name,
      description,
      due_date: `${dueDate}T${dueTime}:00`,
      category_id: categoryId,
    };

    const createdTask = await createTask(taskData);
    console.log("Created task:", createdTask);

    setSnackbarMessage("Task created successfully!");
    setSnackbarOpen(true);

    setName("");
    setDescription("");
    setDueDate(new Date().toISOString().split("T")[0]);
    setCategory("");
    onBack();
    onTaskCreate ();
  };

  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setCategory(e.target.value as string | number);
  };

  const handleAddCategory = () => {
    setIsAddingCategory(true);
  };

  const handleCancelAddCategory = () => {
    setIsAddingCategory(false);
    setCategory("");
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueTime(e.target.value);
  };

  const isDisabled =
    name.trim() === "" || category === "" || (isAddingCategory && category.toString().trim() === "");

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h2">Create Task</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          {isAddingCategory ? (
            <div>
              <TextField
                value={category.toString()}
                onChange={handleCategoryChange}
                fullWidth
              />
              <Button onClick={handleCancelAddCategory}>Show Categories</Button>
            </div>
          ) : (
            <div>
              <Select
                value={category}
                onChange={handleCategoryChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              <Button onClick={handleAddCategory}>New Category</Button>
            </div>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Description"
          value={description}
          multiline
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          label="Due Time"
          type="time"
          value={dueTime}
          onChange={handleTimeChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleCreateTask} disabled={isDisabled}>
          Create Task
        </Button>
        <Button onClick={onBack}>Back</Button>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Grid>
  );
};

export default CreateTask;
