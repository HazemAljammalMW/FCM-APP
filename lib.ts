import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "./firebase/firebase";
import { LoginFormState, LoginSchema } from "./lib/definitions";

export async function login(state: LoginFormState, formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const user = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  console.log(user);
  try {
    await signInWithEmailAndPassword(auth, user.email, user.password);
    if (auth.currentUser) {
      console.log("User logged in successfully!");
    }
  } catch (error) {
    console.error("Login error:", (error as Error).message);
  }
}
