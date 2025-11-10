import createApiClient from "./apiClient";

export const productService = {
  async getProductById(token, productId) {
    const apiClient = createApiClient(token);
    console.log(
      `[productService] getProductById: Recibido productId: ${productId}`,
    );
    try {
      const response = await apiClient.get(`/api/v1/products/${productId}`);
      console.log(
        "[productService] getProductById: Respuesta de API exitosa:",
        response.data,
      );
      return response.data;
    } catch (error) {
      console.error(
        `[productService] getProductById: Error en la petición para productId ${productId}:`,
        error,
      );
      throw new Error("No se pudo obtener la información del producto.");
    }
  },

  async getCategoryById(token, categoryId) {
    const apiClient = createApiClient(token);
    console.log(
      `[productService] getCategoryById: Recibido categoryId: ${categoryId}`,
    );
    try {
      const response = await apiClient.get(
        `/api/v1/categories/byid/${categoryId}`,
      );
      console.log(
        "[productService] getCategoryById: Respuesta de API exitosa:",
        response.data,
      );
      return response.data;
    } catch (error) {
      console.error(
        `[productService] getCategoryById: Error en la petición para categoryId ${categoryId}:`,
        error,
      );
      throw new Error("No se pudo obtener la información de la categoría.");
    }
  },

  async getProducts(token, { categoryId, q, page, size }) {
    const apiClient = createApiClient(token);
    try {
      const params = new URLSearchParams({ page, size });
      if (categoryId) params.append("categoryId", categoryId);
      if (q) params.append("q", q);

      const response = await apiClient.get(
        `/api/v1/products?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        "[productService] getProducts: Error fetching products:",
        error,
      );
      throw new Error("No se pudieron obtener los productos.");
    }
  },

  async getCategoriesTree(token) {
    const apiClient = createApiClient(token);
    try {
      const response = await apiClient.get("/api/v1/categories/tree");
      return response.data;
    } catch (error) {
      console.error(
        "[productService] getCategoriesTree: Error fetching categories:",
        error,
      );
      throw new Error("No se pudieron obtener las categorías.");
    }
  },

  async getImageBlob(token, imageId) {
    const apiClient = createApiClient(token);
    try {
      const response = await apiClient.get(`/api/v1/images/${imageId}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error(
        `[productService] getImageBlob: Error fetching image blob with ID ${imageId}:`,
        error,
      );
      throw error;
    }
  },
};
