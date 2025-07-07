"use server";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function serverAuth() {
  try {
    const h = await headers();
    const session = await auth.api.getSession({
      headers: h, // you need to pass the headers object.
    });
    if (!session) throw new Error("No session found");
    return session;
  } catch (error) {
    return null;
  }
}
