import { jwtDecode } from "jwt-decode";

export function getTokenExpiry(token: string): number | null {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null; // ms
  } catch {
    return null;
  }
}