export const DraftStore = {
  get(key: string) {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(key) ?? "";
    } catch {
      return "";
    }
  },
  set(key: string, value: string) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore quota errors */
    }
  },
  clear(key: string) {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};
