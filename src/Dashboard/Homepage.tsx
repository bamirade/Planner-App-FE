import { useState } from 'react';
import CategoryList from './Category/CategoryList';
import TasksList from './Task/TasksList';
import TodayTaskList from './TodayTask/TodayTaskList';

const Homepage = () => {
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [showTasksList, setShowTasksList] = useState(false);

  const handleShowCategoryList = () => {
    setShowCategoryList(true);
    setShowTasksList(false);
  };

  const handleShowTasksList = () => {
    setShowCategoryList(false);
    setShowTasksList(true);
  };

  const handleBack = () => {
    setShowCategoryList(false);
    setShowTasksList(false);
  };

  return (
    <div>
      <h1>Welcome to Your Journal/Planner App</h1>
      <TodayTaskList />
      {!showCategoryList && !showTasksList && (
        <div>
          <button onClick={handleShowCategoryList}>View Categories</button>
          <button onClick={handleShowTasksList}>View Today's Tasks</button>
        </div>
      )}
      {showCategoryList && (
        <>
          <CategoryList onBack={handleBack} />
          <button onClick={handleBack}>Back</button>
        </>
      )}
      {showTasksList && (
        <>
          <TasksList onBack={handleBack} />
          <button onClick={handleBack}>Back</button>
        </>
      )}
    </div>
  );
};

export default Homepage;
