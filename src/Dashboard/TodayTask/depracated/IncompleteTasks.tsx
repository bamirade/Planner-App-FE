import React, { useState } from "react";
import { Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import WarningIcon from "@mui/icons-material/Warning";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface Task {
  id: number;
  name: string;
  due_date: string;
  is_completed: boolean;
}

interface IncompleteTasksProps {
  tasks: Task[];
  handleCompleteTask: (taskId: number) => void;
  handleUndoTask: (taskId: number) => void;
}

const IncompleteTasks: React.FC<IncompleteTasksProps> = ({ tasks, handleCompleteTask, handleUndoTask }) => {
  const tasksPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const renderTaskTime = (dueDate: string) => {
    if (!dueDate) {
      return "No time entered";
    }
    const date = new Date(dueDate);
    const localTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return localTime;
  };

  // Filter incomplete tasks with due date/time in the future
  const currentDate = new Date().toISOString();
  const incompleteTasks = tasks.filter((task) => !task.is_completed && task.due_date > currentDate);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, lastPageIndex));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const lastPageIndex = Math.ceil(incompleteTasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentIncompleteTasks = incompleteTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <>
      {currentIncompleteTasks.length === 0 ? (
        <Typography variant="body1">No incomplete tasks for today.</Typography>
      ) : (
        <List>
          {currentIncompleteTasks.map((task) => (
            <ListItem key={task.id} disableGutters>
              <ListItemText
                primary={task.name}
                secondary={renderTaskTime(task.due_date)}
                primaryTypographyProps={{
                  style: {
                    color: task.due_date < currentDate ? "red" : "inherit",
                  },
                }}
              />
              {task.due_date < currentDate && (
                <Typography color="error" variant="inherit">
                  <WarningIcon fontSize="small" />
                </Typography>
              )}
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleCompleteTask(task.id)}>
                  <CheckIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {incompleteTasks.length > tasksPerPage && (
        <div>
          <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton onClick={handleNextPage} disabled={currentPage === lastPageIndex}>
            <NavigateNextIcon />
          </IconButton>
        </div>
      )}
    </>
  );
};

export default IncompleteTasks;
