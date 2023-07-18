import React, { useEffect, useState } from "react";
import {
  Category,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/category";
import CreateCategory from "./CreateCategory";
import EditCategory from "./EditCategory";

interface CategoryListProps {
  onBack: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onBack }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (
    categoryId: number,
    updatedData: Partial<Category>
  ) => {
    try {
      await updateCategory(categoryId, updatedData);
      setShowEditModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingCategory(null);
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
                <li key={category.id}>
                  {category.name}
                  <button onClick={() => handleDeleteCategory(category.id)}>
                    Delete
                  </button>
                  <button onClick={() => handleEditCategory(category)}>
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={handleShowNewCategory}>Create Category</button>
          <button onClick={onBack}>Back</button>
        </>
      )}
      {showNewCategory && (
        <>
          <CreateCategory
            onBack={handleBack}
            onCategoryCreated={handleCategoryCreated}
          />
        </>
      )}
      {showEditModal && editingCategory && (
        <EditCategory
          category={editingCategory}
          onUpdateCategory={handleUpdateCategory}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default CategoryList;
