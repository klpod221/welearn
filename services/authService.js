import { signIn, signOut } from "next-auth/react";

export const login = async ({ username, password }) => {
  const res = await signIn("credentials", {
    redirect: false,
    username,
    password,
  });

  if (res?.error) {
    throw new Error(res.error);
  }

  return res;
};

export const logout = async () => {
  const res = await signOut({ redirect: false });

  if (res?.error) {
    throw new Error(res.error);
  }

  return res;
};
