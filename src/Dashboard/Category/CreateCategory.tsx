import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
} from "@mui/material";
import { createCategory } from "../../api/category";

interface CreateCategoryProps {
  onBack: () => void;
  onCategoryCreated: () => void;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({
  onBack,
  onCategoryCreated,
}) => {
  const [name, setName] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setSnackbarMessage("Name cannot be empty.");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    try {
      await createCategory({ name });
      onCategoryCreated();
      onBack();
      setSnackbarMessage("Category created successfully.");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error creating category:", error);
      setSnackbarMessage("Error category already exists");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Create Category
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={handleNameChange}
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!name.trim()}
        >
          Create
        </Button>
        <Button onClick={onBack} variant="outlined" style={{ margin: "8px" }}>
          Cancel
        </Button>
      </form>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default CreateCategory;
