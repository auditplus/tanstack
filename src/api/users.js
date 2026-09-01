//Get users from the server.
const USERS_URL = "https://dummyjson.com/users";

export async function loadUsers() {
  const response = await fetch(USERS_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch users: ${response.status}`
    );
  }

  const result = await response.json();

  return result.users;
}