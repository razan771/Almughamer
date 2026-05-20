const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDb, getDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'almanara-secret-key-123';

app.use(cors());
app.use(express.json({ limit: '15mb' }));

app.use((err, req, res, next) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Image is too large. Please upload a smaller image.' });
  }
  next(err);
});

initDb().then(() => console.log('Database initialized successfully.')).catch(console.error);

app.get('/', (req, res) => {
  res.send('Al-Tasneem Veterinary Pharmacy API is running! 🚀');
});

// ----------------- Auth Middlewares -----------------
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, authData) => {
      if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
      req.user = authData;
      next();
    });
  } else {
    res.status(401).json({ success: false, message: 'No token provided' });
  }
}

function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only' });
    next();
  });
}

// ----------------- Auth Routes -----------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const db = await getDb();
    const hash = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hash]);
    res.json({ success: true });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      res.status(400).json({ success: false, message: 'Email already exists' });
    } else {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = await getDb();
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (isMatch) {
      const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// ----------------- Public Products API -----------------
app.get('/api/products', async (req, res) => {
  const db = await getDb();
  const products = await db.all('SELECT *, cast(id as text) as id FROM products');
  res.json(products);
});

// ----------------- Admin Products API -----------------
app.post('/api/products', verifyAdmin, async (req, res) => {
  const { name, description, price, image, category, forPet } = req.body;
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO products (name, description, price, image, category, forPet) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, image, category, forPet]
  );
  res.json({ id: String(result.lastID) });
});

app.put('/api/products/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, category, forPet } = req.body;
  const db = await getDb();
  await db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, image = ?, category = ?, forPet = ? WHERE id = ?',
    [name, description, price, image, category, forPet, id]
  );
  res.json({ success: true });
});

app.delete('/api/products/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const db = await getDb();
  await db.run('DELETE FROM products WHERE id = ?', [id]);
  res.json({ success: true });
});

// ----------------- User Orders API -----------------
app.get('/api/user/orders', verifyToken, async (req, res) => {
  const db = await getDb();
  const orders = await db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  const parsedOrders = orders.map(o => ({ ...o, items: JSON.parse(o.items) }));
  res.json(parsedOrders);
});

app.post('/api/orders', verifyToken, async (req, res) => {
  const { items, total, payment_method } = req.body;
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO orders (user_id, items, total, payment_method) VALUES (?, ?, ?, ?)',
    [req.user.id, JSON.stringify(items), total, payment_method || 'cash_on_delivery']
  );
  res.json({ id: result.lastID, success: true });
});

// ----------------- Admin Orders API -----------------
app.get('/api/admin/orders', verifyAdmin, async (req, res) => {
  const db = await getDb();
  const orders = await db.all(`
    SELECT orders.*, users.name as user_name, users.email as user_email
    FROM orders
    LEFT JOIN users ON orders.user_id = users.id
    ORDER BY orders.created_at DESC
  `);
  const parsedOrders = orders.map(o => ({ ...o, items: JSON.parse(o.items) }));
  res.json(parsedOrders);
});

app.put('/api/admin/orders/:id/status', verifyAdmin, async (req, res) => {
  const { status } = req.body;
  const db = await getDb();
  await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
