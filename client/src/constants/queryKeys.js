export const QUERY_KEYS = {
  PRODUCTS: {
    all: ["products"],
    featured: ["products", "featured"],
    byId: (id) => ["products", id],
    byCategory: (category) => ["products", "category", category],
  },
  USERS: {
    all: ["users"],
    profile: ["users", "profile"],
  },
};
