import axios from "axios";
//const API_URL = "http://localhost:8080/api";
export async function loginRequest(email, password) {
  /*
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  return response.data;
  */

  
  console.warn("Backend-ul nu este activ — folosim login MOCK!");

  await new Promise((resolve) => setTimeout(resolve, 600));

  const mockUsers = [
    {
      email: "organizer@test.com",
      password: "1234",
      role: "organizer",
      name: "Organizer Oana"
    },
    {
      email: "author@test.com",
      password: "1234",
      role: "author",
      name: "Author Alex"
    },
    {
      email: "reviewer@test.com",
      password: "1234",
      role: "reviewer",
      name: "Reviewer Rares"
    }
  ];

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return {
    token: "fake-jwt-token-123",
    user: {
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
}
