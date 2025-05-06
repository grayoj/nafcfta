import jwt from "jsonwebtoken";

export function authenticateAdmin(token: string | undefined) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role === "ADMIN") {
      return decoded;
    }
  } catch (err) {
    return null;
  }

  return null;
}

export function authenticateDCA(token: string | undefined) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role === "DCA") {
      return decoded;
    }
  } catch (err) {
    return null;
  }

  return null;
}

export function authenticateUser(token: string | undefined) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded;
  } catch (err) {
    return null;
  }
}
