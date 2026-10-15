
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:6010";

export default API_URL;


export const registerCustomer = async (customerData) => {
  const response = await fetch(`${API_URL}/customers/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(customerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

// tis is for login page
export const loginCustomer = async (loginData) => {
  const response = await fetch(`${API_URL}/customers/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Invalid Credentials");
  }

  return data;
};

// to oGet logged-in customer
export const getCurrentCustomer = async () => {
  const response = await fetch(`${API_URL}/customers/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Not authenticated");
  }

  return data;
};

// Logout customer
export const logoutCustomer = async () => {
  const response = await fetch(`${API_URL}/customers/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Logout failed");
  }

  return data;
};