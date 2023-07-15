import axios, { AxiosError } from 'axios';
import key from './key'

const API_URL = key.API_URL;

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const getCategory = async (categoryId: number): Promise<Category> => {
  try {
    const response = await axios.get<Category>(`${API_URL}/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return {} as Category;
  }
};

export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
  try {
    const response = await axios.post<Category>(`${API_URL}/categories`, categoryData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return {} as Category;
  }
};

export const updateCategory = async (categoryId: number, categoryData: Partial<Category>): Promise<Category> => {
  try {
    const response = await axios.patch<Category>(`${API_URL}/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return {} as Category;
  }
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/categories/${categoryId}`);
  } catch (error) {
    handleApiError(error);
  }
};

const handleApiError = (error: unknown): never => {
  const axiosError = error as AxiosError<ErrorResponse> | undefined;
  if (axiosError && axiosError.response) {
    const { data } = axiosError.response;
    if (data.errors) {
      throw new Error(data.message);
    } else {
      throw new Error(data.message);
    }
  } else {
    throw new Error('Network Error');
  }
};
