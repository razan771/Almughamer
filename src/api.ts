const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const api = {
  getProducts: async () => {
    const res = await fetch(`${BASE_URL}/products`);
    return res.json();
  },
  addProduct: async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteProduct: async (id: string, token: string) => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },
  updateProduct: async (id: string, data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  checkout: async (items: any[], total: number, paymentMethod: string, token: string) => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ items, total, payment_method: paymentMethod }),
    });
    return res.json();
  },
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },
  getUserOrders: async (token: string) => {
    const res = await fetch(`${BASE_URL}/user/orders`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },
  getAdminOrders: async (token: string) => {
    const res = await fetch(`${BASE_URL}/admin/orders`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },
  updateOrderStatus: async (id: number, status: string, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    return res.json();
  }
}
