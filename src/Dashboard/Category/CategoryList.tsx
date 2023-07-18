import React, { useEffect, useState } from "react";
import { Category, getCategories, createCategory } from "../../api/category";
import CreateCategory from "./CreateCategory";

interface CategoryListProps {
  onBack: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onBack }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleShowNewCategory = () => {
    setShowNewCategory(true);
  };

  const handleBack = () => {
    setShowNewCategory(false);
  };

  const handleCategoryCreated = () => {
    fetchCategories();
  };

  return (
    <div>
      {!showNewCategory && (
        <>
          <h2>Categories</h2>
          {categories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <ul>
              {categories.map((category) => (
                <li key={category.id}>{category.name}</li>
              ))}
            </ul>
          )}
          <button onClick={handleShowNewCategory}>Create Category</button>
          <button onClick={onBack}>Back</button>
        </>
      )}
      {showNewCategory && (
        <>
          <CreateCategory onBack={handleBack} onCategoryCreated={handleCategoryCreated} />
        </>
      )}
    </div>
  );
};

export default CategoryList;
