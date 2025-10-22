const API_URL = process.env.REACT_APP_API_URL;

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/api/users`);
  return response.json();
};
