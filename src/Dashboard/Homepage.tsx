import React, { useState } from "react";
import CategoryList from "./Category/CategoryList";
import TasksList from "./Task/TasksList";
import CreateTask from "./Task/CreateTask.tsx";
import TodayTaskList from "./TodayTask/TodayTaskList";

const Homepage: React.FC = () => {
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [showTasksList, setShowTasksList] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);

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

  return (
    <div>
      {!showCategoryList && !showTasksList && !showNewTask && (
        <>
          <h1>Welcome to Your Journal/Planner App</h1>
          <TodayTaskList />
          <div>
            <button onClick={handleShowCategoryList}>View Categories</button>
            <button onClick={handleShowTasksList}>View Tasks</button>
            <button onClick={handleShowNewTask}>Create Task</button>
          </div>
        </>
      )}
      {showCategoryList && (
        <>
          <CategoryList onBack={handleBack} />
        </>
      )}
      {showTasksList && (
        <>
          <TasksList onBack={handleBack} handleShowNewTask={handleShowNewTask} />
        </>
      )}
      {showNewTask && (
        <>
          <CreateTask onBack={handleBack} />
        </>
      )}
    </div>
  );
};

export default Homepage;
