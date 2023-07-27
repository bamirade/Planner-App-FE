import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  Paper,
  Grid,
  Tooltip,
  Fab,
} from "@mui/material";
import CategoryList from "./Category/CategoryList";
import TasksList from "./Task/TasksList";
import CreateTask from "./Task/CreateTask";
import TodayTaskList from "./TodayTask/TodayTaskList";
import { Add as AddIcon } from "@mui/icons-material";

interface HomepageProps {
  handleLogout: () => void; // Add handleLogout prop
}


const Homepage: React.FC<HomepageProps> = ({ handleLogout }) => {
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [showTasksList, setShowTasksList] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  const handleShowCategoryList = () => {
    setShowCategoryList(true);
    setShowTasksList(false);
    setShowNewTask(false);
  };

  const handleShowTasksList = () => {
    setShowCategoryList(false);
    setShowTasksList(true);
    setShowNewTask(false);
  };

  const handleShowNewTask = () => {
    setShowCategoryList(false);
    setShowTasksList(false);
    setShowNewTask(true);
  };

  const handleBack = () => {
    setShowCategoryList(false);
    setShowTasksList(false);
    setShowNewTask(false);
  };

  const updateDateTime = () => {
    const currentDateObj = new Date();
    setCurrentDate(currentDateObj.toLocaleDateString());
    setCurrentTime(currentDateObj.toLocaleTimeString());
  };

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
  };


  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1">{currentDate}</Typography>
            <Typography variant="subtitle2">{currentTime}</Typography>
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Your Journal/Planner App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ paddingTop: 4 }}>
        {!showCategoryList && !showTasksList && !showNewTask && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">
                Welcome to Your Journal/Planner App
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TodayTaskList />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button variant="outlined" onClick={handleShowCategoryList}>
                  View Categories
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleShowTasksList}
                  sx={{ ml: 1 }}
                >
                  View Tasks
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleShowNewTask}
                  sx={{ ml: 1 }}
                >
                  Create Task
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
        {showCategoryList && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <CategoryList onBack={handleBack} />
          </Paper>
        )}
        {showTasksList && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <TasksList
              onBack={handleBack}
              handleShowNewTask={handleShowNewTask}
            />
          </Paper>
        )}
        {showNewTask && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <CreateTask onBack={handleBack} />
          </Paper>
        )}
      </Container>

      {/* Add a floating "Create Task" button */}
      {!showCategoryList && !showTasksList && !showNewTask && (
        <Tooltip title="Create New Task" placement="left">
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              zIndex: 10,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
              },
            }}
            onClick={handleShowNewTask}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleLogoutClick}
        sx={{
          mt: 2,
        }}
      >
        Logout
      </Button>
    </>
  );
};

export default Homepage;
