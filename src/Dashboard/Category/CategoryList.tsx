import React, { useEffect, useState } from "react";
import {
  Category,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/category";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import EditCategory from "./EditCategory";
import CreateCategory from "./CreateCategory"; // Add this import

interface CategoryListProps {
  onBack: () => void;
}

enum SortBy {
  Default = "Default",
  NameAsc = "Name (A-Z)",
  NameDesc = "Name (Z-A)",
}

const CategoryList: React.FC<CategoryListProps> = ({ onBack }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Default);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [categories]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
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
    setSnackbarMessage("Category created successfully.");
    setSnackbarSeverity("success");
    setShowSnackbar(true);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      setDeletingCategory(null);
      await deleteCategory(categoryId);
      fetchCategories();
      setSnackbarMessage("Category deleted successfully.");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error deleting category:", error);
      setSnackbarMessage("Error deleting category.");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
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
      setSnackbarMessage("Category updated successfully.");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error updating category:", error);
      setSnackbarMessage("Error category already exists");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingCategory(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedSort = event.target.value as SortBy;
    setSortBy(selectedSort);

    switch (selectedSort) {
      case SortBy.Default:
        setCategories([...categories].sort((a, b) => a.id - b.id));
        break;
      case SortBy.NameAsc:
        setCategories(
          [...categories].sort((a, b) => a.name.localeCompare(b.name))
        );
        break;
      case SortBy.NameDesc:
        setCategories(
          [...categories].sort((a, b) => b.name.localeCompare(a.name))
        );
        break;
    }
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <Box p={2} minHeight={"80vh"}>
      {showNewCategory ? (
        <CreateCategory
          onBack={handleBack}
          onCategoryCreated={handleCategoryCreated}
        />
      ) : (
        <>
          <Typography variant="h4">Categories</Typography>
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Typography variant="body1" style={{ marginRight: "8px" }}>
              Sort By:
            </Typography>
            <Select value={sortBy} onChange={handleSortChange}>
              <MenuItem value={SortBy.Default}>{SortBy.Default}</MenuItem>
              <MenuItem value={SortBy.NameAsc}>{SortBy.NameAsc}</MenuItem>
              <MenuItem value={SortBy.NameDesc}>{SortBy.NameDesc}</MenuItem>
            </Select>
          </Box>
          {loading ? (
            <CircularProgress />
          ) : categories.length === 0 ? (
            <Typography variant="body1">No categories found.</Typography>
          ) : (
            <>
              <List>
                {categories
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((category) => (
                    <ListItem key={category.id}>
                      <ListItemText primary={category.name} />
                      <Box>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEditCategory(category)}
                          style={{ marginRight: "8px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setDeletingCategory(category)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
              </List>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt={2}
              >
                <Typography variant="body1">
                  Page {currentPage} of {totalPages}
                </Typography>
                <IconButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  size="small"
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  size="small"
                >
                  <NavigateNextIcon />
                </IconButton>
              </Box>
            </>
          )}
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              onClick={handleShowNewCategory}
              variant="contained"
              color="primary"
            >
              Create Category
            </Button>
            <Button onClick={onBack} style={{ marginLeft: "8px" }}>
              Back
            </Button>
          </Box>
        </>
      )}
      <Dialog open={showEditModal} onClose={handleCancelEdit}>
        <DialogContent>
          {editingCategory && (
            <EditCategory
              category={editingCategory}
              onUpdateCategory={handleUpdateCategory}
              onCancel={handleCancelEdit}
              showSnackbar={setShowSnackbar}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the category and its related tasks:{" "}
          <b>{deletingCategory?.name}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingCategory(null)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteCategory(deletingCategory?.id || -1)}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default CategoryList;
