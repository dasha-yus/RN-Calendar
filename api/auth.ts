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

  return {
    token: response.data.idToken,
    refreshToken: response.data.refreshToken,
    expiresIn: response.data.expiresIn,
  };
}

export function createUser(email: string, password: string) {
  return authenticate("signUp", email, password);
}

export function login(email: string, password: string) {
  return authenticate("signInWithPassword", email, password);
}

export async function invokeRefreshToken(refreshToken: string) {
  const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.EXPO_PUBLIC_FIREBASE_API_KEY}`;

  const response = await axios.post(url, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  return {
    token: response.data.idToken,
    refreshToken: response.data.refreshToken,
    expiresIn: response.data.expiresIn,
  };
}
