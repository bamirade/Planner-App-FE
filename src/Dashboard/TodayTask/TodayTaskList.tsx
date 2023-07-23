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
} from "@mui/material";
import {
  Task,
  getTasks,
  markTaskAsCompleted,
  updateTask,
} from "../../api/task";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

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
      console.log(updatedTasks);
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
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                    />
                    <ListItemSecondaryAction>
                      {task.is_completed ? (
                        <IconButton
                          edge="end"
                          onClick={() => handleUndoTask(task.id)}
                        >
                          <ClearIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          edge="end"
                          onClick={() => handleCompleteTask(task.id)}
                        >
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
              <IconButton
                onClick={() => setCurrentTasksPage(currentTasksPage - 1)}
                disabled={currentTasksPage === 1}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton
                onClick={() => setCurrentTasksPage(currentTasksPage + 1)}
                disabled={
                  currentTasksPage * tasksPerPage >= currentTasks.length
                }
              >
                <NavigateNextIcon />
              </IconButton>
            </div>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expandedSection === "incomplete"}
        onChange={() => handleChangeSection("incomplete")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                          <IconButton
                            edge="end"
                            onClick={() => handleUndoTask(task.id)}
                          >
                            <ClearIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            edge="end"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <CheckIcon />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
              </List>
              {incompleteTasks.length > tasksPerPage && (
                <div>
                  <IconButton
                    onClick={() =>
                      setIncompleteTasksPage(incompleteTasksPage - 1)
                    }
                    disabled={incompleteTasksPage === 1}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      setIncompleteTasksPage(incompleteTasksPage + 1)
                    }
                    disabled={
                      incompleteTasksPage * tasksPerPage >=
                      incompleteTasks.length
                    }
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </div>
              )}
            </>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === "complete"}
        onChange={() => handleChangeSection("complete")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                          <IconButton
                            edge="end"
                            onClick={() => handleUndoTask(task.id)}
                          >
                            <ClearIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            edge="end"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <CheckIcon />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
              </List>
              {completedTasks.length > tasksPerPage && (
                <div>
                  <IconButton
                    onClick={() =>
                      setCompletedTasksPage(completedTasksPage - 1)
                    }
                    disabled={completedTasksPage === 1}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      setCompletedTasksPage(completedTasksPage + 1)
                    }
                    disabled={
                      completedTasksPage * tasksPerPage >= completedTasks.length
                    }
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </div>
              )}
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default TodayTaskList;
