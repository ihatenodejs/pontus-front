import { verifySolution } from "altcha-lib";

export async function verifyCaptcha(token: string): Promise<boolean> {
  const hmacKey = process.env.ALTCHA_SECRET;

  if (!hmacKey) {
    console.error("ALTCHA_SECRET is not set");
    return false;
  }

  if (!token) {
    return false;
  }

  try {
    const isValid = await verifySolution(token, hmacKey);
    return isValid;
  } catch (error) {
    console.error("[ALTCHA] Error:", error);
    return false;
  }
}