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

interface RegisterResponse {
    data: {
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


/// register //

const REGISTER_ENDPOINT = '/auth/register';


/// "Credentials" the shape TS expects//
interface RegisterUser {
name: string,
email: string,
password: string

}

export async function  registerUser(registerUser: RegisterUser): Promise <UserProfile>  {
    try {
        const response = await post<RegisterResponse>(REGISTER_ENDPOINT, registerUser);

        if (!response) {
            throw new Error('Registration successful, but no accesstoken received');
        }

        const profile = response.data;

        storage.save<UserProfile>('profile', profile);
        console.log(profile);
        return profile as UserProfile;

    }catch(error: unknown) {
     console.error('Registration failed', error);
     throw error;
    }
}




