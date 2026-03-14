export const getProducts = async (query="") => {
  const res = await fetch(`/api/products?q=${query}`, {
    method: "GET",
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`/api/products/${id}`, {
    method: "GET",
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};

export const getBackendVersion = async () => {
  const res = await fetch(`/api/version`);

  if (!res.ok) {
    throw new Error("Failed to fetch backend version");
  }

  return res.text();
};