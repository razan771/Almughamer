const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function readResponse(res: Response) {
  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || 'تعذر قراءة استجابة الخادم' };
  }

  if (!res.ok) {
    throw new Error(data.message || 'تعذر تنفيذ العملية');
  }

  return data;
}

export const api = {
  getProducts: async () => {
    const res = await fetch(`${BASE_URL}/products`);
    return readResponse(res);
  },
  addProduct: async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return readResponse(res);
  },
  deleteProduct: async (id: string, token: string) => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return readResponse(res);
  },
  updateProduct: async (id: string, data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return readResponse(res);
  },
  checkout: async (items: any[], total: number, paymentMethod: string, token: string) => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ items, total, payment_method: paymentMethod }),
    });
    return readResponse(res);
  },
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return readResponse(res);
  },
  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return readResponse(res);
  },
  getUserOrders: async (token: string) => {
    const res = await fetch(`${BASE_URL}/user/orders`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return readResponse(res);
  },
  getAdminOrders: async (token: string) => {
    const res = await fetch(`${BASE_URL}/admin/orders`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return readResponse(res);
  },
  updateOrderStatus: async (id: number, status: string, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    return readResponse(res);
  }
}
