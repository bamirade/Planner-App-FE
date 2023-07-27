import React, { useState } from "react";
import { Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import WarningIcon from "@mui/icons-material/Warning";

interface Task {
  id: number;
  name: string;
  due_date: string;
  is_completed: boolean;
}

interface CurrentTasksProps {
  tasks: Task[];
  handleCompleteTask: (taskId: number) => void;
  handleUndoTask: (taskId: number) => void;
}

const CurrentTasks: React.FC<CurrentTasksProps> = ({ tasks, handleCompleteTask, handleUndoTask }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const renderTaskTime = (dueDate: string) => {
    if (!dueDate) {
      return "No time entered";
    }
    const time = dueDate.split("T")[1].split(":").slice(0, 2).join(":");
    return time;
  };

  const currentDate = new Date().toISOString();

  // Filter incomplete tasks that have not passed their due date/time
  const currentTasks = tasks.filter(
    (task) => !task.is_completed && (!task.due_date || task.due_date >= currentDate)
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const tasksToDisplay = currentTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <>
      {tasksToDisplay.length === 0 ? (
        <Typography variant="body1">No tasks for today.</Typography>
      ) : (
        <List>
          {tasksToDisplay.map((task) => (
            <ListItem key={task.id} disableGutters>
              <ListItemText
                primary={task.name}
                secondary={renderTaskTime(task.due_date)}
                primaryTypographyProps={{
                  style: {
                    textDecoration: task.is_completed ? "line-through" : "none",
                    color: task.is_completed ? "green" : task.due_date && task.due_date < currentDate ? "red" : "inherit",
                  },
                  endAdornment: task.due_date && task.due_date < currentDate && !task.is_completed && (
                    <WarningIcon color="error" fontSize="small" />
                  ),
                }}
              />
              <ListItemSecondaryAction>
                {task.is_completed ? (
                  <IconButton edge="end" onClick={() => handleUndoTask(task.id)}>
                    <ClearIcon />
                  </IconButton>
                ) : (
                  <IconButton edge="end" onClick={() => handleCompleteTask(task.id)}>
                    <CheckIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {currentTasks.length > tasksPerPage && (
        <div>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={indexOfLastTask >= currentTasks.length}>
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default CurrentTasks;
