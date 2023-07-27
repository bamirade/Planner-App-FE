import React, { useState } from "react";
import { Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

interface Task {
  id: number;
  name: string;
  due_date: string;
  is_completed: boolean;
}

interface CompleteTasksProps {
  tasks: Task[];
  handleCompleteTask: (taskId: number) => void;
  handleUndoTask: (taskId: number) => void;
}

const CompleteTasks: React.FC<CompleteTasksProps> = ({ tasks, handleCompleteTask, handleUndoTask }) => {
  const tasksPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const renderTaskTime = (dueDate: string) => {
    if (!dueDate) {
      return "No time entered";
    }
    const time = dueDate.split("T")[1].split(":").slice(0, 2).join(":");
    return time;
  };

  // Filter completed tasks
  const completedTasks = tasks.filter((task) => task.is_completed);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentCompletedTasks = completedTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <>
      {currentCompletedTasks.length === 0 ? (
        <Typography variant="body1">No completed tasks for today.</Typography>
      ) : (
        <List>
          {currentCompletedTasks.map((task) => (
            <ListItem key={task.id} disableGutters>
              <ListItemText
                primary={task.name}
                secondary={renderTaskTime(task.due_date)}
                primaryTypographyProps={{
                  style: {
                    color: "green", // Make text green for completed tasks
                    textDecoration: "line-through",
                  },
                }}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleUndoTask(task.id)}>
                  <ClearIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {completedTasks.length > tasksPerPage && (
        <div>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={indexOfLastTask >= completedTasks.length}>
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default CompleteTasks;
