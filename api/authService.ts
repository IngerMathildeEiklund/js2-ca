import { post } from "./apiClient";

import { storage } from "../storage/storage";


const LOGIN_ENDPOINT = '/auth/login';

interface Credentials {
    email: string, 
    password: string
}

interface AuthResponse {
    data: {
        accessToken: string,
        name: string, 
        email: string,
        [key: string]: any
    }
}

interface UserProfile {
    name: string, 
    email: string,
    [key: string]: any
}


export async function loginUser(credentials: Credentials): Promise <UserProfile> {

    const response = await post<AuthResponse>(LOGIN_ENDPOINT, credentials);

    if (!response?.data?.accessToken) {
        throw new Error('Login successful, but no access token received.');
    }
    const { accessToken, ...profile } = response.data;

    storage.save('accessToken', accessToken);
    storage.save<UserProfile>('profile', profile);

    return profile as UserProfile;
}


export function logOut(): void {
    storage.remove('accessToken');
    storage.remove('profile');

    // add a toast notif and redirect// 

};