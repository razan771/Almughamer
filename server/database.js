const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

async function getDb() {
  const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
  const db = new DatabaseSync(dbPath);

  return {
    exec(sql) {
      return db.exec(sql);
    },
    get(sql, params = []) {
      return db.prepare(sql).get(...params);
    },
    all(sql, params = []) {
      return db.prepare(sql).all(...params);
    },
    run(sql, params = []) {
      const result = db.prepare(sql).run(...params);
      return {
        ...result,
        lastID: result.lastInsertRowid ? Number(result.lastInsertRowid) : undefined,
      };
    },
  };
}

async function initDb() {
  const db = await getDb();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      category TEXT,
      forPet TEXT
    );
  `);

  try {
    const ordersInfo = await db.all("PRAGMA table_info(orders)");
    const hasUserId = ordersInfo.some(i => i.name === 'user_id');
    if (ordersInfo.length > 0 && !hasUserId) {
      await db.exec('DROP TABLE orders;');
    }
  } catch(e) {}

  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      payment_method TEXT DEFAULT 'cash_on_delivery',
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  const adminEmail = 'almughameer';
  const adminPassword = '01mughameer10';
  const legacyAdminEmail = 'ibrahim.aboualow.96@gmail.com';
  const hash = await bcrypt.hash(adminPassword, 10);
  
  const existingAdmin = await db.get(`SELECT id FROM users WHERE email = ? OR email = ? OR role = 'admin'`, [adminEmail, legacyAdminEmail]);
  if (!existingAdmin) {
    await db.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      ['مدير المغامر الفضي', adminEmail, hash, 'admin']
    );
    console.log('Seeded admin user.');
  } else {
    await db.run(`UPDATE users SET name = ?, email = ?, password_hash = ?, role = ? WHERE id = ?`, ['مدير المغامر الفضي', adminEmail, hash, 'admin', existingAdmin.id]);
    await db.run(`DELETE FROM users WHERE email = ? AND id != ?`, [legacyAdminEmail, existingAdmin.id]);
    console.log('Updated existing admin credentials.');
  }

  const count = await db.get(`SELECT COUNT(*) as count FROM products`);
  if (count.count === 0) {
    const products = [
      {
        name: 'مقوي المفاصل المتقدم',
        description: 'مكمل غذائي عالي الجودة يحتوي على الجلوكوزامين والكوندرويتين لدعم المفاصل والقدرة على التحمل.',
        price: 45.99,
        image: '/images/hero-camel.png',
        category: 'المكملات الغذائية',
        forPet: 'هجن السباق',
      },
      {
        name: 'قطرات مكافحة الطفيليات',
        description: 'علاج موضعي شهري يقضي على القراد والطفيليات بفعالية وأمان.',
        price: 32.50,
        image: '/images/camel-hero.png',
        category: 'مكافحة الطفيليات',
        forPet: 'الإبل والحيران',
      },
      {
        name: 'معجون الطاقة والتحمل',
        description: 'تركيبة بيطرية سريعة الامتصاص لتعزيز الطاقة وتقليل الإجهاد أثناء سباقات الهجن.',
        price: 28.00,
        image: '/images/hero-camel.png',
        category: 'فيتامينات',
        forPet: 'هجن السباق',
      },
      {
        name: 'زيوت الأوميغا بلس للشعر',
        description: 'زيوت طبيعية غنية بأحماض أوميغا 3 لدعم صحة الجلد وجمال الوبر.',
        price: 22.99,
        image: '/images/camel-hero.png',
        category: 'المكملات الغذائية',
        forPet: 'جميع الإبل',
      }
    ];

    for (const p of products) {
      await db.run(
        `INSERT INTO products (name, description, price, image, category, forPet) VALUES (?, ?, ?, ?, ?, ?)`,
        [p.name, p.description, p.price, p.image, p.category, p.forPet]
      );
    }
    console.log('Seeded database with initial products.');
  }

  return db;
}

module.exports = { getDb, initDb };
