import { LoginSchema } from "@/lib/definitions";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "@/firebase/firebase";

export async function login(formData: FormData) {
  // Validate form data
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      error: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      return { ok: true, data: user };
    } else {
      return { ok: false, error: "Login failed: No user returned" };
    }
  } catch (error) {
    console.error("Login error:", (error as Error).message);
    return { ok: false, error: (error as Error).message };
  }
}