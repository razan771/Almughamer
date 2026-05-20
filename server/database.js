require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let pool = null;

async function getDb() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set in environment variables');
    }
    
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return {
    async exec(sql) {
      return pool.query(sql);
    },
    async get(sql, params = []) {
      const result = await pool.query(sql, params);
      return result.rows[0];
    },
    async all(sql, params = []) {
      const result = await pool.query(sql, params);
      return result.rows;
    },
    async run(sql, params = []) {
      const result = await pool.query(sql, params);
      return {
        ...result,
        lastID: result.rows && result.rows.length > 0 ? result.rows[0].id : undefined,
        changes: result.rowCount
      };
    },
  };
}

async function initDb() {
  const db = await getDb();
  
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        image TEXT,
        category TEXT,
        forPet TEXT
      );
    `);

    try {
      const ordersInfo = await db.all("SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'");
      const hasUserId = ordersInfo.some(i => i.column_name === 'user_id');
      if (ordersInfo.length > 0 && !hasUserId) {
        await db.exec('DROP TABLE orders;');
      }
    } catch(e) {}

    await db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        items TEXT NOT NULL,
        total NUMERIC NOT NULL,
        payment_method TEXT DEFAULT 'whatsapp',
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    const adminEmail = 'almughameer';
    const adminPassword = '01mughameer10';
    const legacyAdminEmail = 'ibrahim.aboualow.96@gmail.com';
    const hash = await bcrypt.hash(adminPassword, 10);
    
    const existingAdmin = await db.get(`SELECT id FROM users WHERE email = $1 OR email = $2 OR role = 'admin'`, [adminEmail, legacyAdminEmail]);
    if (!existingAdmin) {
      await db.run(
        `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id`,
        ['مدير المغامر الفضي', adminEmail, hash, 'admin']
      );
      console.log('Seeded admin user.');
    } else {
      await db.run(`UPDATE users SET name = $1, email = $2, password_hash = $3, role = $4 WHERE id = $5`, ['مدير المغامر الفضي', adminEmail, hash, 'admin', existingAdmin.id]);
      await db.run(`DELETE FROM users WHERE email = $1 AND id != $2`, [legacyAdminEmail, existingAdmin.id]);
      console.log('Updated existing admin credentials.');
    }

    const countResult = await db.get(`SELECT COUNT(*) as count FROM products`);
    // PostgreSQL count returns a string
    if (parseInt(countResult.count, 10) === 0) {
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
          `INSERT INTO products (name, description, price, image, category, forPet) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [p.name, p.description, p.price, p.image, p.category, p.forPet]
        );
      }
      console.log('Seeded database with initial products.');
    }
  } catch (err) {
    console.error("Database initialization failed:", err);
  }

  return db;
}

module.exports = { getDb, initDb };
