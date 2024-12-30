import axios from "axios";

async function authenticate(
  mode: "signUp" | "signInWithPassword",
  email: string,
  password: string
) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${process.env.EXPO_PUBLIC_FIREBASE_API_KEY}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  console.log(response.data);
}

export async function createUser(email: string, password: string) {
  await authenticate("signUp", email, password);
}

export async function login(email: string, password: string) {
  await authenticate("signInWithPassword", email, password);
}
