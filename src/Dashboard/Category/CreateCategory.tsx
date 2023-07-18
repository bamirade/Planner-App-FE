import { useState } from "react";
import { createCategory } from "../../api/category";

interface CreateCategoryProps {
  onBack: () => void;
  onCategoryCreated: () => void;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({ onBack, onCategoryCreated }) => {
  const [name, setName] = useState("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createCategory({ name });
      onCategoryCreated();
      onBack();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div>
      <h2>Create Category</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <button type="submit">Create</button>
        <button onClick={onBack}>Cancel</button>
      </form>
    </div>
  );
};

export default CreateCategory;
