import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Task,
  getTasks,
  markTaskAsCompleted,
  updateTask,
} from "../../api/task";
import {
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  Warning as WarningIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";

const TodayTaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTasksPage, setCurrentTasksPage] = useState(1);
  const [incompleteTasksPage, setIncompleteTasksPage] = useState(1);
  const [completedTasksPage, setCompletedTasksPage] = useState(1);
  const [expandedSection, setExpandedSection] = useState<
    "current" | "incomplete" | "complete"
  >("current");
  const tasksPerPage = 5;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const today = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000
  ).toISOString();

  const todayTasks = tasks
    .filter((task) => task.due_date.split("T")[0] === today.split("T")[0])
    .sort((taskA, taskB) => {
      const dateA = new Date(taskA.due_date);
      const dateB = new Date(taskB.due_date);
      return dateA - dateB;
    });

  const currentTasks = todayTasks.filter(
    (task) => !task.is_completed && task.due_date >= today
  );

  const incompleteTasks = todayTasks.filter(
    (task) => !task.is_completed && task.due_date <= today
  );

  const completedTasks = todayTasks.filter((task) => task.is_completed);

  const handleCompleteTask = async (taskId: number) => {
    try {
      const updatedTask = await markTaskAsCompleted(taskId);
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const handleUndoTask = async (taskId: number) => {
    try {
      const updatedTask = await updateTask(taskId, { is_completed: false });
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error undoing task completion:", error);
    }
  };

  const renderTaskTime = (dueDate: string) => {
    if (!dueDate) {
      return "No time entered";
    }

    const dateObj = new Date(dueDate);

    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();

    const time = `${
      hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    }:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;

    return time;
  };

  const handleChangeSection = (
    section: "current" | "incomplete" | "complete"
  ) => {
    setExpandedSection(section);
  };

  return (
    <div>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Today's Tasks
      </Typography>
      <Accordion
        expanded={expandedSection === "current"}
        onChange={() => handleChangeSection("current")}
      >
        <AccordionSummary expandIcon={<NavigateBeforeIcon />}>
          Current
        </AccordionSummary>
        <AccordionDetails>
          {currentTasks.length === 0 ? (
            <Typography variant="body1">No tasks for today.</Typography>
          ) : (
            <List>
              {currentTasks
                .slice(
                  (currentTasksPage - 1) * tasksPerPage,
                  currentTasksPage * tasksPerPage
                )
                .map((task) => (
                  <ListItem key={task.id} disableGutters>
                    <ListItemText
                      primary={task.name}
                      secondary={renderTaskTime(task.due_date)}
                      primaryTypographyProps={{
                        style: {
                          color: task.is_completed ? "green" : "inherit",
                          textDecoration: task.is_completed
                            ? "line-through"
                            : "none",
                        },
                      }}
                    />
                    <ListItemSecondaryAction>
                      {task.is_completed ? (
                        <Tooltip title="Undo" placement="top">
                          <IconButton
                            edge="end"
                            onClick={() => handleUndoTask(task.id)}
                            size="small"
                          >
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Mark as Completed" placement="top">
                          <IconButton
                            edge="end"
                            onClick={() => handleCompleteTask(task.id)}
                            size="small"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          )}

          {currentTasks.length > tasksPerPage && (
            <Box mt={2}>
              <IconButton
                onClick={() => setCurrentTasksPage(currentTasksPage - 1)}
                disabled={currentTasksPage === 1}
                size="small"
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton
                onClick={() => setCurrentTasksPage(currentTasksPage + 1)}
                disabled={
                  currentTasksPage * tasksPerPage >= currentTasks.length
                }
                size="small"
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === "incomplete"}
        onChange={() => handleChangeSection("incomplete")}
      >
        <AccordionSummary expandIcon={<NavigateBeforeIcon />}>
          Passed Due date
        </AccordionSummary>
        <AccordionDetails>
          {incompleteTasks.length === 0 ? (
            <Typography variant="body1">
              No passed due date tasks for today.
            </Typography>
          ) : (
            <>
              <List>
                {incompleteTasks
                  .slice(
                    (incompleteTasksPage - 1) * tasksPerPage,
                    incompleteTasksPage * tasksPerPage
                  )
                  .map((task) => (
                    <ListItem key={task.id} disableGutters>
                      <ListItemText
                        primary={task.name}
                        secondary={renderTaskTime(task.due_date)}
                        primaryTypographyProps={{
                          style: {
                            color: "red",
                          },
                        }}
                      />
                      <Typography color="error" variant="inherit">
                        <WarningIcon fontSize="small" />
                      </Typography>
                      <ListItemSecondaryAction>
                        {task.is_completed ? (
                          <Tooltip title="Undo" placement="top">
                            <IconButton
                              edge="end"
                              onClick={() => handleUndoTask(task.id)}
                              size="small"
                            >
                              <ClearIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Mark as Completed" placement="top">
                            <IconButton
                              edge="end"
                              onClick={() => handleCompleteTask(task.id)}
                              size="small"
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
              </List>
              {incompleteTasks.length > tasksPerPage && (
                <Box mt={2}>
                  <IconButton
                    onClick={() => setIncompleteTasksPage(incompleteTasksPage - 1)}
                    disabled={incompleteTasksPage === 1}
                    size="small"
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setIncompleteTasksPage(incompleteTasksPage + 1)}
                    disabled={
                      incompleteTasksPage * tasksPerPage >= incompleteTasks.length
                    }
                    size="small"
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </Box>
              )}
            </>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === "complete"}
        onChange={() => handleChangeSection("complete")}
      >
        <AccordionSummary expandIcon={<NavigateBeforeIcon />}>
          Complete
        </AccordionSummary>
        <AccordionDetails>
          {completedTasks.length === 0 ? (
            <Typography variant="body1">
              No completed tasks for today.
            </Typography>
          ) : (
            <>
              <List>
                {completedTasks
                  .slice(
                    (completedTasksPage - 1) * tasksPerPage,
                    completedTasksPage * tasksPerPage
                  )
                  .map((task) => (
                    <ListItem key={task.id} disableGutters>
                      <ListItemText
                        primary={task.name}
                        secondary={renderTaskTime(task.due_date)}
                        primaryTypographyProps={{
                          style: {
                            color: "green",
                            textDecoration: "line-through",
                          },
                        }}
                      />
                      <ListItemSecondaryAction>
                        {task.is_completed ? (
                          <Tooltip title="Undo" placement="top">
                            <IconButton
                              edge="end"
                              onClick={() => handleUndoTask(task.id)}
                              size="small"
                            >
                              <ClearIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Mark as Completed" placement="top">
                            <IconButton
                              edge="end"
                              onClick={() => handleCompleteTask(task.id)}
                              size="small"
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
              </List>
              {completedTasks.length > tasksPerPage && (
                <Box mt={2}>
                  <IconButton
                    onClick={() => setCompletedTasksPage(completedTasksPage - 1)}
                    disabled={completedTasksPage === 1}
                    size="small"
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setCompletedTasksPage(completedTasksPage + 1)}
                    disabled={
                      completedTasksPage * tasksPerPage >= completedTasks.length
                    }
                    size="small"
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </Box>
              )}
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default TodayTaskList;
