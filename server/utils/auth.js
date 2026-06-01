// utils/auth.js
const DEFAULT_JWT_SECRET = "dev-secret";
let warnedMissingJwtSecret = false;

export const getJwtSecret = () => {
  if (!process.env.JWT_SECRET && !warnedMissingJwtSecret) {
    console.warn("JWT_SECRET is not set. Falling back to development secret.");
    warnedMissingJwtSecret = true;
  }

  return process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
};

export const requireAdmin = (user) => {
  if (!user || user.role !== "admin") {
    throw new Error("Access denied: Admins only");
  }
};
