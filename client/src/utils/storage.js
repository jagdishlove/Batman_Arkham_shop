export const local = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;

      // Try parsing; if it fails, return raw string
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch {
      return fallback;
    }
  },

  set: (key, value) => {
    try {
      const val = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, val);
    } catch {}
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },
};
