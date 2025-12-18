const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

export function checkAdminAuth(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function setAdminSession() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("admin_authenticated", "true");
  }
}

export function clearAdminSession() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("admin_authenticated");
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("admin_authenticated") === "true";
  }
  return false;
}
