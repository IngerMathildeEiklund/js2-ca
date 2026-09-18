import { post } from "./apiClient";
import { storage } from "../storage/storage";
import { API_KEY } from "../storage/config";

const LOGIN_ENDPOINT = "/auth/login";

interface Credentials {
  email: string;
  password: string;
}

interface AuthResponse {
  data: {
    accessToken: string;
    name: string;
    email: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  bio?: string,
  avatar?: {
    url: string,
    alt: string
  }
}

/**
 *
 * @param credentials The credentials the user enters, email and password.
 * @returns a data object with a valid access token, name, email.
 * @throws {Error} if the user successfully logs in, but no access token gets stored.
 */

export async function loginUser(
  credentials: Credentials
): Promise<UserProfile> {
  const response = await post<AuthResponse>(LOGIN_ENDPOINT, credentials);

  if (!response?.data?.accessToken) {
    throw new Error("Login successful, but no access token received.");
  }
  const { accessToken, ...profile } = response.data;

  storage.save("accessToken", accessToken);
  storage.save("apiKey", API_KEY);
  storage.save<UserProfile>("profile", profile);

  return profile as UserProfile;
}

export function logOut(): void {
  storage.remove("accessToken");
  storage.remove("profile");
  window.location.href = './login.html';
}

/// REGISTER //

const REGISTER_ENDPOINT = "/auth/register";

interface RegisterUser {
  name: string;
  email: string;
  password: string;
  avatar?: {
    url: string,
    alt: string
  }
}

interface RegisterResponse {
  data: {
    name: string;
    email: string;
    [key: string]: any;
  };
}
/**
 *
 * @param registerUser The users credentials, name, email and password.
 * @returns a successfully newly created profile object.
 * @throws {Error} if the server does not respond.
 * @throws {Error} if there are missing fields.
 * @throws Rethrows any errors from the API Client. {@link ApiError}
 */

export async function registerUser(
  registerUser: RegisterUser
): Promise<UserProfile> {
  try {
    const response = await post<RegisterResponse>(
      REGISTER_ENDPOINT,
      registerUser
    );

    if (!response) {
      throw new Error("Registration failed, no response from server");
    }

    const profile = response.data;

    if (!profile?.name || !profile?.email) {
      throw new Error(
        "Registration succeeded, but no profile data was returned."
      );
    }
    storage.save<UserProfile>("profile", profile);
    return profile;
  } catch (error: unknown) {
    console.error("Registration failed", error);
    throw error;
  }
}
