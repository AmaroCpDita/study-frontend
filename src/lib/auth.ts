import { cookies } from "next/headers";

export interface Profile {
  id: number;
  user_id: string;
  full_name: string;
  institution: string;
  major: string;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  profile?: Profile;
}

export interface AuthResponse {
  user: {
    id: string;
    full_name: string;
    institution: string;
    major: string;
  };
  message: string;
}

export const AUTH_COOKIE_NAME = "popstudy_session";

// ---- Centralized Session Handling ----

export async function setSession(userId: string, rememberMe: boolean = false) {
  // If rememberMe is true, session lasts 30 days. Otherwise, 24 hours.
  const days = rememberMe ? 30 : 1;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000); 

  // In a real app, you would generate a JWT or opaque session token here
  // and store it in a database. For this mock, we use the userId directly.
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expires,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  return sessionCookie; // Returns the userId in this mock
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
