import React, { useState, useEffect } from "react";
import { Task, updateTask } from "../../api/task";
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

interface EditTaskProps {
  task: Task;
  onUpdateTask: (taskId: number, updatedData: Partial<Task>) => void;
  onCancel: () => void;
}

const getTimeFromDate = (dateTime: string) => {
  const dateObj = new Date(dateTime);
  return dateObj.toISOString().slice(11, 16);
};

const EditTask: React.FC<EditTaskProps> = ({
  task,
  onUpdateTask,
  onCancel,
}) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.due_date);
  const [dueTime, setDueTime] = useState(getTimeFromDate(task.due_date));
  const [category, setCategory] = useState<string | number>(task.category_id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
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

  const handleUpdateTask = async () => {
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
        setSnackbarMessage("Task updated successfully.");
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage("Error category already exists");
        setSnackbarOpen(true);
        return;
      }
    }

    const updatedTaskData: Partial<Task> = {
      name,
      description,
      due_date: `${dueDate}T${dueTime}:00`,
      category_id: categoryId,
    };

    onUpdateTask(task.id, updatedTaskData);

    setName("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setCategory("");
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h2">Edit Task</Typography>
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
              <Button onClick={handleCancelAddCategory}>-</Button>
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
        <Button variant="contained" onClick={handleUpdateTask}>
          Update Task
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Grid>
  );
};

export default EditTask;
