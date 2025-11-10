import createApiClient from "./apiClient";

export const couponService = {
  /**
   * Crea un nuevo cupón de descuento. (Rol: Admin)
   * @param {string} token - The auth token.
   * @param {object} couponData - Datos del cupón a crear.
   * @param {string} couponData.codigo - El código único del cupón.
   * @param {number} couponData.porcentajeDescuento - El porcentaje de descuento.
   * @param {string} couponData.fechaExpiracion - Fecha en formato ISO 8601.
   * @param {number} couponData.usosMaximos - El número máximo de usos.
   * @returns {Promise<object>} El cupón creado.
   */
  createCoupon(token, couponData) {
    const apiClient = createApiClient(token);
    return apiClient
      .post("/api/v1/cupones", couponData)
      .then((res) => res.data);
  },

  /**
   * Obtiene una lista paginada de cupones. (Rol: Admin)
   * @param {string} token - The auth token.
   * @param {object} params - Parámetros de consulta.
   * @param {string} [params.codigo] - Filtrar por código.
   * @param {boolean} [params.activo] - Filtrar por estado.
   * @param {number} [params.page=0] - Número de página.
   * @param {number} [params.size=20] - Tamaño de página.
   * @returns {Promise<object>} La lista paginada de cupones.
   */
  getCoupons(token, params = {}) {
    const apiClient = createApiClient(token);
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/api/v1/cupones?${query}`).then((res) => res.data);
  },

  /**
   * Valida un código de cupón sin aplicarlo. (Rol: User, Admin)
   * @param {string} token - The auth token.
   * @param {string} codigo - El código del cupón a validar.
   * @returns {Promise<object>} El resultado de la validación.
   */
  validateCoupon(token, codigo) {
    const apiClient = createApiClient(token);
    return apiClient
      .post("/api/v1/cupones/validar", { codigo })
      .then((res) => res.data);
  },

  /**
   * Aplica un cupón al carrito de compras. (Rol: User, Admin)
   * @param {string} token - The auth token.
   * @param {string} codigo - El código del cupón a aplicar.
   * @returns {Promise<object>} El carrito actualizado.
   */
  applyCouponToCart(token, codigo) {
    const apiClient = createApiClient(token);
    return apiClient
      .post("/api/v1/cart/cupon", { codigo })
      .then((res) => res.data);
  },

  /**
   * Quita el cupón aplicado del carrito. (Rol: User, Admin)
   * @param {string} token - The auth token.
   * @returns {Promise<object>} El carrito actualizado.
   */
  removeCouponFromCart(token) {
    const apiClient = createApiClient(token);
    // Para quitar, se envía un código vacío.
    return apiClient
      .post("/api/v1/cart/cupon", { codigo: "" })
      .then((res) => res.data);
  },

  /**
   * Actualiza un cupón existente. (Rol: Admin)
   * @param {string} token - The auth token.
   * @param {number} couponId - El ID del cupón a actualizar.
   * @param {object} couponData - Los datos a actualizar.
   * @returns {Promise<object>} El cupón actualizado.
   */
  updateCoupon(token, couponId, couponData) {
    const apiClient = createApiClient(token);
    return apiClient
      .put(`/api/v1/cupones/${couponId}`, couponData)
      .then((res) => res.data);
  },
};
