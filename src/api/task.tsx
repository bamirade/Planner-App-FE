import axios, { AxiosError } from 'axios';
import key from './key';

const API_URL = key.API_URL;

const getToken = () => {
  return localStorage.getItem('token') as string;
};

export interface Task {
  id: number;
  name: string;
  description: string;
  due_date: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  is_completed: boolean;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export const getTasks = async (categoryId?: number): Promise<Task[]> => {
  try {
    const url = categoryId
      ? `${API_URL}/categories/${categoryId}/tasks`
      : `${API_URL}/tasks`;
    const response = await axios.get<Task[]>(url, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const getTask = async (taskId: number): Promise<Task> => {
  try {
    const response = await axios.get<Task>(`${API_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    return {} as Task;
  }
};

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  try {
    const response = await axios.post<Task>(`${API_URL}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    return {} as Task;
  }
};

export const updateTask = async (
  taskId: number,
  taskData: Partial<Task>
): Promise<Task> => {
  try {
    const response = await axios.patch<Task>(
      `${API_URL}/tasks/${taskId}`,
      taskData,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    return {} as Task;
  }
};

export const deleteTask = async (taskId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  } catch (error) {
    handleApiError(error);
  }
};

export const markTaskAsCompleted = async (taskId: number): Promise<Task> => {
  try {
    const response = await axios.patch<Task>(
      `${API_URL}/tasks/${taskId}`,
      {
        is_completed: true,
      },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    return {} as Task;
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
