import React, { useState } from "react";
import { Category } from "../../api/category";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";

interface EditCategoryProps {
  category: Category;
  onUpdateCategory: (
    categoryId: number,
    updatedData: Partial<Category>
  ) => Promise<void>;
  onCancel: () => void;
  showSnackbar: (message: string, severity: "success" | "error") => void; // Add this prop
}

const EditCategory: React.FC<EditCategoryProps> = ({
  category,
  onUpdateCategory,
  onCancel,
  showSnackbar,
}) => {
  const [updatedCategoryData, setUpdatedCategoryData] = useState<
    Partial<Category>
  >({
    name: category.name,
  });
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleUpdate = async () => {
    try {
      await onUpdateCategory(category.id, updatedCategoryData);
      setOpenConfirmation(false);
      showSnackbar("Category updated successfully!", "success");
    } catch (error) {
      setOpenConfirmation(false);
      setSnackbarMessage("Error category already exists");
      setSnackbarSeverity("error");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedCategoryData({
      ...updatedCategoryData,
      name: e.target.value,
    });
  };

  const handleOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarMessage("");
  };

  return (
    <div>
      <h2>Edit Category</h2>
      <TextField
        label="Name"
        value={updatedCategoryData.name}
        onChange={handleNameChange}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenConfirmation}
      >
        Update
      </Button>
      <Button variant="outlined" onClick={onCancel} style={{ margin: "8px" }}>
        Cancel
      </Button>
      <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          Are you sure you want to update this category?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Cancel</Button>
          <Button onClick={handleUpdate} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default EditCategory;
