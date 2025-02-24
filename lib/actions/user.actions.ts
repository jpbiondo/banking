"use server";

import { AppwriteException, ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../server/appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { SIGNUP_ERROR_MESSAGES } from "../constants";

export const signIn = async (userData: signInProps) => {
  try {
    const { email, password } = userData;
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(session);
  } catch (error) {
    console.error(error);
  }
};

export const signUp = async (userData: SignUpParams): Promise<AuthResp> => {
  try {
    const { email, password, firstName, lastName } = userData;

    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return {
      success: true,
      data: parseStringify(newUserAccount),
    };
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 409) {
      return {
        success: false,
        error: SIGNUP_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
      };
    }

    return {
      success: false,
      error: SIGNUP_ERROR_MESSAGES.SIGNUP_FAILED,
    };
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    const user = await account.get();

    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export async function logoutAccount() {
  try {
    const { account } = await createSessionClient();

    (await cookies()).delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
}
