import React, { useEffect, useState } from "react";
import { Task, getTasks, updateTask, deleteTask } from "../../api/task";
import { Category, getCategories } from "../../api/category";
import EditTask from "./EditTask";
import {
  Box,
  IconButton,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Snackbar,
} from "@mui/material";
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";

interface TasksListProps {
  onBack: () => void;
  handleShowNewTask: () => void;
}

const TasksList: React.FC<TasksListProps> = ({ onBack, handleShowNewTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    new Date().toISOString().slice(0, 10)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;
  const [loading, setLoading] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const [deleteSnackbarMessage, setDeleteSnackbarMessage] = useState("");
  const [editSnackbarOpen, setEditSnackbarOpen] = useState(false);
  const [editSnackbarMessage, setEditSnackbarMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchTasks();
    }
  }, [selectedCategory, selectedDate, currentPage, categories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedDate]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await getTasks(selectedCategory);
      const filteredTasks = selectedDate
        ? fetchedTasks.filter(
            (task) => task.due_date.split("T")[0] === selectedDate
          )
        : fetchedTasks;
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const categoryId = event.target.value as number;
    setSelectedCategory(categoryId === 0 ? undefined : categoryId);
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      setDeletingTask(null);
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
      setDeleteSnackbarMessage("Task deleted successfully.");
      setDeleteSnackbarOpen(true);
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
      setEditSnackbarMessage("Task updated successfully.");
      setEditSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingTask(null);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  return (
    <Box p={2} minHeight={"80vh"}>
      <Typography variant="h4">Tasks</Typography>
      <Grid container alignItems="center" justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            type="date"
            value={selectedDate || ""}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory || 0}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value={0}>All</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {loading ? (
        <CircularProgress />
      ) : tasks.length === 0 ? (
        <Typography variant="body1">No tasks found for this date.</Typography>
      ) : (
        <>
          <ul>
            {tasks
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((task) => (
                <li
                  key={task.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Typography style={{ flex: 1, flexGrow: 1, textAlign: "left" }}>{task.name}</Typography>
                  <Box>
                    <Button
                      onClick={() => handleEditTask(task)}
                      variant="outlined"
                      style={{ marginRight: "8px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeletingTask(task)}
                      variant="outlined"
                    >
                      Delete
                    </Button>
                  </Box>
                </li>
              ))}
          </ul>
          <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              <Typography variant="body1">
                Page {currentPage} of {totalPages}
              </Typography>
              <IconButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                size="small"
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                size="small"
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>
          </>
        )}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button onClick={handleShowNewTask} variant="contained" color="primary">
          Create Task
        </Button>
        <Button onClick={onBack} style={{ marginLeft: "8px" }}>
          Back
        </Button>
      </Box>
      <Dialog open={showEditModal} onClose={handleCancelEdit}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {editingTask && (
            <EditTask
              task={editingTask}
              onUpdateTask={handleUpdateTask}
              onCancel={handleCancelEdit}
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the task: <b>{deletingTask?.name}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingTask(null)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteTask(deletingTask?.id || -1)}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={deleteSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setDeleteSnackbarOpen(false)}
        message={deleteSnackbarMessage}
      />

      <Snackbar
        open={editSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setEditSnackbarOpen(false)}
        message={editSnackbarMessage}
      />
    </Box>
  );
};

export default TasksList;
