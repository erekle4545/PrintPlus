// shared/api/profile.ts
import { axiosInstance } from "@/shared/hooks/useHttp";
import { User } from "@/types/auth/auth";

export async function getProfile(): Promise<User> {
    const response = await axiosInstance.get<{ user: User }>('/user');
    return response.data.user;
}

export async function updateProfileData(data: Partial<User>): Promise<User> {
    const response = await axiosInstance.put<{ user: User }>('/user', data);
    return response.data.user;
}

export interface ChangePasswordData {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

export async function changePassword(data: ChangePasswordData): Promise<User> {
    const response = await axiosInstance.put<{ user: User }>('/change-password', data);
    return response.data.user;
}