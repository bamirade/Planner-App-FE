import axios, { AxiosError } from 'axios';
import key from './key';

const API_URL = key.API_URL;

const getToken = () => {
  return localStorage.getItem('token') as string;
};

export interface User {
  id: number;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ErrorResponse {
  error: string;
}

export const registerUser = async (userData: Partial<User>): Promise<string | null> => {
  try {
    const user = { user: userData }
    const response = await axios.post<string>(`${API_URL}/signup`, user);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export const loginUser = async (userCredentials: Partial<User>): Promise<string | null> => {
  try {
    const user = { user: userCredentials };
    const response = await axios.post<string>(`${API_URL}/login`, user);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export const getLoggedInUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get<User>(`${API_URL}/users/show`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export const updateUser = async (userData: Partial<User>): Promise<User | null> => {
  try {
    const response = await axios.patch<User>(`${API_URL}/users/update`, userData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export const updatePassword = async (passwordData: {
  password: string;
  password_confirmation: string;
}): Promise<string | null> => {
  try {
    const response = await axios.patch<string>(`${API_URL}/users/update_password`, passwordData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export const deleteUser = async (): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/users/destroy`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  } catch (error) {
    handleApiError(error);
  }
};

export const updateEmail = async (newEmail: string): Promise<User | null> => {
  try {
    const response = await axios.patch<User>(
      `${API_URL}/users/update_email`,
      { email: newEmail },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

const handleApiError = (error: unknown): never => {
  const axiosError = error as AxiosError<ErrorResponse> | undefined;
  if (axiosError && axiosError.response) {
    const { data } = axiosError.response;
    throw new Error(data.error);
  } else {
    throw new Error('Network Error');
  }
};
