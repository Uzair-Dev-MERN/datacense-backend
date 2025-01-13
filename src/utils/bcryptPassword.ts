import bcrypt from "bcryptjs";

// Hash password
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Verify password
export const verifyPassword = async (enteredPassword: string, storedHashedPassword: string) => {
  const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
  return isMatch;
};
