import React, { useState } from "react";
import { Category } from "../../api/category";

interface EditCategoryProps {
  category: Category;
  onUpdateCategory: (
    categoryId: number,
    updatedData: Partial<Category>
  ) => void;
  onCancel: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({
  category,
  onUpdateCategory,
  onCancel,
}) => {
  const [updatedCategoryData, setUpdatedCategoryData] = useState<
    Partial<Category>
  >({
    name: category.name,
  });

  const handleUpdate = () => {
    onUpdateCategory(category.id, updatedCategoryData);
  };

  return (
    <div>
      <h2>Edit Category</h2>
      <label>
        Name:
        <input
          type="text"
          value={updatedCategoryData.name}
          onChange={(e) =>
            setUpdatedCategoryData({
              ...updatedCategoryData,
              name: e.target.value,
            })
          }
        />
      </label>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditCategory;
