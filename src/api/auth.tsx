import axios from 'axios';
import key from './key';

const BASE_URL = key.API_URL;

interface AuthResponse {
  token: string;
}

export const signUp = async (email: string, password: string, password_confirmation: string): Promise<AuthResponse | null> => {
  try {
    const response = await axios.post<AuthResponse>(`${BASE_URL}/signup`, {
      user: { email, password, password_confirmation },
    });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error during sign up:', error);
    return null;
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse | null> => {
  try {
    const response = await axios.post<AuthResponse>(`${BASE_URL}/login`, {
      user: { email, password },
    });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

export const updateUser = async (userId: number, userData: any): Promise<any> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('User is not authenticated.');
    }

    const response = await axios.patch<any>(`${BASE_URL}/users/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('User is not authenticated.');
    }

    await axios.delete(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updatePassword = async (userId: number, passwordData: any): Promise<void> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('User is not authenticated.');
    }

    await axios.patch(`${BASE_URL}/users/${userId}/update_password`, passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<any> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('User is not authenticated.');
    }

    const response = await axios.get<any>(`${BASE_URL}/users/current`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function logout(): void {
  localStorage.removeItem('token');
}
