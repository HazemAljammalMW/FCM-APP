import { LoginSchema } from "@/lib/definitions";
import { signInWithEmailAndPassword } from "firebase/auth"; // Fixed import
import { auth } from "@/firebase/firebase";

export async function login(formData: FormData) {
  // Validate form data
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // 🔹 FIXED: Await the token retrieval
    const token = await userCredential.user.getIdToken();

    // Send token to the API for session creation
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to authenticate");
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
