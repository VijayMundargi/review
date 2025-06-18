
"use server";

import { z } from 'zod';
import { getUsers, setUsers, User } from '@/lib/localStorage.ts'; // Assuming direct access for demo; in real app, use DB
import { v4 as uuidv4 } from 'uuid'; // For generating user IDs

// This is a server-side simulation. In a real app, localStorage utilities would not be directly used here.
// Instead, you'd interact with a database. For this example, we'll assume these functions
// can be called on the server for demonstration purposes or are proxied.

const LoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const RegisterSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginUser(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const validationResult = LoginSchema.safeParse(rawFormData);

  if (!validationResult.success) {
    return { success: false, errors: validationResult.error.flatten().fieldErrors };
  }

  const { username, password } = validationResult.data;

  // Simulate database access
  const users = getUsers(); // This needs to work server-side or be mocked
  const user = users.find(u => u.username === username && u.password === password); // In real app, hash password

  if (user) {
    // Remove password before returning to client
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } else {
    return { success: false, generalError: "Invalid username or password." };
  }
}

export async function registerUser(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const validationResult = RegisterSchema.safeParse(rawFormData);

  if (!validationResult.success) {
    return { success: false, errors: validationResult.error.flatten().fieldErrors };
  }

  const { username, password } = validationResult.data;

  // Simulate database access
  let users = getUsers();
  if (users.find(u => u.username === username)) {
    return { success: false, generalError: "Username already exists." };
  }

  const newUser: User = {
    id: uuidv4(),
    username,
    password, // In real app, hash password
  };

  users.push(newUser);
  setUsers(users); // This needs to work server-side or be mocked

  // Remove password before returning to client
  const { password: _, ...userWithoutPassword } = newUser;
  return { success: true, user: userWithoutPassword };
}
