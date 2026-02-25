const nameRegex = /^[A-Za-z\s]+$/;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: "author" | "reader";
}

export const validateSignup = (data: SignupInput): string[] => {
  const errors: string[] = [];

  if (!data.name || !nameRegex.test(data.name)) {
    errors.push("Name must contain only alphabets and spaces.");
  }

  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.push("Invalid email format.");
  }

  if (!data.password || !strongPasswordRegex.test(data.password)) {
    errors.push(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    );
  }

  if (!data.role || !["author", "reader"].includes(data.role)) {
    errors.push("Role must be either 'author' or 'reader'.");
  }

  return errors;
};