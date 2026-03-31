require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors({ origin: true }));
app.use(express.json());

let sequelize;

if (process.env.DB_USE_SQLITE === 'true') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || 'database.sqlite',
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_DATABASE || 'webban',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: false,
      dialectOptions: process.env.DB_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : undefined,
    }
  );
}

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Nhân viên' },
}, {
  tableName: 'users',
  timestamps: true,
});

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  brand: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  originalPrice: { type: DataTypes.INTEGER, allowNull: true },
  specs: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 4.5 },
  reviews: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  image: { type: DataTypes.STRING, allowNull: true, defaultValue: '📱' },
  description: { type: DataTypes.TEXT, allowNull: false },
  details: { type: DataTypes.TEXT, allowNull: false },
  fullDescription: { type: DataTypes.TEXT, allowNull: true },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
}, {
  tableName: 'products',
  timestamps: true,
});

const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  brand: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true, defaultValue: '📱' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
}, {
  tableName: 'cart_items',
  timestamps: true,
});

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customerName: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Khách lẻ' },
  customerEmail: { type: DataTypes.STRING, allowNull: true },
  customerPhone: { type: DataTypes.STRING, allowNull: true },
  customerAddress: { type: DataTypes.STRING, allowNull: true },
  totalAmount: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
  paymentMethod: { type: DataTypes.STRING, allowNull: false, defaultValue: 'cash' },
  paymentStatus: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
  itemsJson: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'orders',
  timestamps: true,
});

const defaultProducts = [
  {
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 35900000,
    originalPrice: 39990000,
    specs: '6.7" AMOLED | A17 Pro | 256GB',
    rating: 4.8,
    reviews: 245,
    image: '📱',
    description: 'Flagship iPhone mới nhất với công nghệ camera tiên tiến',
    details: 'Màn hình AMOLED 6.7 inch, Chip A17 Pro, Camera 48MP, Pin 4685mAh, 5G, Titanium',
    fullDescription: 'iPhone 15 Pro Max là chiếc iPhone mạnh nhất của Apple với chip A17 Pro và thiết kế Titanium.',
    stock: 15,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 32990000,
    originalPrice: 36990000,
    specs: '6.8" Dynamic AMOLED | Snapdragon 8 Gen 3',
    rating: 4.7,
    reviews: 189,
    image: '📱',
    description: 'Điện thoại flagship của Samsung với hiệu năng cực mạnh',
    details: 'Màn hình Dynamic AMOLED 120Hz, Snapdragon 8 Gen 3, Camera 50MP, 5000mAh, S Pen',
    fullDescription: 'Galaxy S24 Ultra nổi bật với S Pen tích hợp, camera chất lượng cao và hiệu năng flagship.',
    stock: 12,
  },
  {
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    price: 19990000,
    originalPrice: 22990000,
    specs: '6.73" AMOLED | Snapdragon 8 Gen 3',
    rating: 4.6,
    reviews: 156,
    image: '📱',
    description: 'Giá tốt nhất cho flagship performance',
    details: 'Màn hình AMOLED 120Hz, Snapdragon 8 Gen 3, Camera Leica 50MP, 5000mAh',
    fullDescription: 'Xiaomi 14 Ultra mang lại hiệu năng mạnh và hệ thống camera Leica ấn tượng.',
    stock: 20,
  },
  {
    name: 'OPPO Find X6 Pro',
    brand: 'OPPO',
    price: 21990000,
    originalPrice: 24990000,
    specs: '6.82" AMOLED | Snapdragon 8 Gen 3',
    rating: 4.5,
    reviews: 98,
    image: '📱',
    description: 'Thiết kế đẹp với công nghệ sạc nhanh',
    details: 'Màn hình AMOLED 120Hz, Snapdragon 8 Gen 3, Sạc 100W, Camera 50MP',
    fullDescription: 'OPPO Find X6 Pro phù hợp người dùng thích thiết kế cao cấp và sạc siêu nhanh.',
    stock: 18,
  },
  {
    name: 'iPhone 15',
    brand: 'Apple',
    price: 26900000,
    originalPrice: 29990000,
    specs: '6.1" Super Retina | A16 Bionic',
    rating: 4.7,
    reviews: 312,
    image: '📱',
    description: 'iPhone tiêu chuẩn với hiệu năng mạnh mẽ',
    details: 'Màn hình 6.1 inch, A16 Bionic, Camera 48MP, 5G',
    fullDescription: 'iPhone 15 là lựa chọn cân bằng giữa hiệu năng, thiết kế và độ ổn định.',
    stock: 25,
  },
  {
    name: 'Samsung Galaxy A54',
    brand: 'Samsung',
    price: 12990000,
    originalPrice: 14990000,
    specs: '6.4" Super AMOLED | Exynos 1380',
    rating: 4.4,
    reviews: 267,
    image: '📱',
    description: 'Smartphone tầm trung tốt nhất hiện nay',
    details: 'Màn hình Super AMOLED 120Hz, Exynos 1380, Camera 50MP, Pin 5000mAh',
    fullDescription: 'Galaxy A54 là mẫu máy tầm trung nổi bật với pin bền, màn hình đẹp và camera ổn định.',
    stock: 30,
  },
];

const serializeOrder = (orderInstance) => {
  const order = orderInstance.get ? orderInstance.get({ plain: true }) : orderInstance;
  return {
    ...order,
    items: order.itemsJson ? JSON.parse(order.itemsJson) : [],
  };
};

app.get('/', (req, res) => {
  res.json({
    message: 'PhoneHub backend is running',
    endpoints: [
      '/api/health',
      '/api/users',
      '/api/products',
      '/api/cart',
      '/api/orders',
    ],
  });
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({ order: [['id', 'ASC']] });
    res.json(users);
  } catch (err) {
    console.error('GET /api/users error', err);
    res.status(500).json({ error: 'Lỗi khi truy vấn users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User không tồn tại' });
    res.json(user);
  } catch (err) {
    console.error('GET /api/users/:id error', err);
    res.status(500).json({ error: 'Lỗi khi truy vấn user' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Thiếu fields name/email/role' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    const newUser = await User.create({ name, email, role });
    res.status(201).json(newUser);
  } catch (err) {
    console.error('POST /api/users error', err);
    res.status(500).json({ error: 'Lỗi khi tạo user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User không tồn tại' });

    if (email) {
      const sameEmail = await User.findOne({ where: { email, id: { [Sequelize.Op.ne]: user.id } } });
      if (sameEmail) {
        return res.status(400).json({ error: 'Email đã được sử dụng' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error('PUT /api/users/:id error', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User không tồn tại' });

    await user.destroy();
    res.json({ message: 'Xóa user thành công' });
  } catch (err) {
    console.error('DELETE /api/users/:id error', err);
    res.status(500).json({ error: 'Lỗi khi xóa user' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['id', 'ASC']] });
    res.json(products);
  } catch (err) {
    console.error('GET /api/products error', err);
    res.status(500).json({ error: 'Lỗi khi truy vấn products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    res.json(product);
  } catch (err) {
    console.error('GET /api/products/:id error', err);
    res.status(500).json({ error: 'Lỗi khi truy vấn sản phẩm' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, brand, price, specs, description, details } = req.body;
    if (!name || !brand || !price || !specs || !description || !details) {
      return res.status(400).json({ error: 'Thiếu thông tin sản phẩm bắt buộc' });
    }

    const product = await Product.create({
      ...req.body,
      price: Number(price),
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : null,
      stock: Number(req.body.stock || 10),
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('POST /api/products error', err);
    res.status(500).json({ error: 'Lỗi khi tạo sản phẩm' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại' });

    await product.update({
      ...req.body,
      price: req.body.price ? Number(req.body.price) : product.price,
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : product.originalPrice,
      stock: req.body.stock ? Number(req.body.stock) : product.stock,
    });

    res.json(product);
  } catch (err) {
    console.error('PUT /api/products/:id error', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại' });

    await product.destroy();
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (err) {
    console.error('DELETE /api/products/:id error', err);
    res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    const items = await CartItem.findAll({ order: [['id', 'ASC']] });
    res.json(items);
  } catch (err) {
    console.error('GET /api/cart error', err);
    res.status(500).json({ error: 'Lỗi khi truy vấn giỏ hàng' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const { productId, name, brand, price, image, quantity = 1 } = req.body;
    if (!productId || !name || !brand || !price) {
      return res.status(400).json({ error: 'Thiếu thông tin cart item' });
    }

    const existing = await CartItem.findOne({ where: { productId } });
    if (existing) {
      existing.quantity += Number(quantity) || 1;
      await existing.save();
      return res.json(existing);
    }

    const item = await CartItem.create({
      productId: Number(productId),
      name,
      brand,
      price: Number(price),
      image: image || '📱',
      quantity: Number(quantity) || 1,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error('POST /api/cart error', err);
    res.status(500).json({ error: 'Lỗi khi thêm vào giỏ hàng' });
  }
});

app.put('/api/cart/:id', async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Cart item không tồn tại' });

    const quantity = Number(req.body.quantity);
    if (!quantity || quantity <= 0) {
      await item.destroy();
      return res.json({ message: 'Đã xóa item khỏi giỏ hàng' });
    }

    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error('PUT /api/cart/:id error', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật giỏ hàng' });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Cart item không tồn tại' });

    await item.destroy();
    res.json({ message: 'Xóa cart item thành công' });
  } catch (err) {
    console.error('DELETE /api/cart/:id error', err);
    res.status(500).json({ error: 'Lỗi khi xóa cart item' });
  }
});

app.delete('/api/cart', async (req, res) => {
  try {
    await CartItem.destroy({ where: {} });
    res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
  } catch (err) {
    console.error('DELETE /api/cart error', err);
    res.status(500).json({ error: 'Lỗi khi xóa giỏ hàng' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['id', 'DESC']] });
    res.json(orders.map(serializeOrder));
  } catch (err) {
    console.error('GET /api/orders error', err);
    res.status(500).json({ error: 'Lỗi khi truy vấn đơn hàng' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    res.json(serializeOrder(order));
  } catch (err) {
    console.error('GET /api/orders/:id error', err);
    res.status(500).json({ error: 'Lỗi khi truy vấn đơn hàng' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, items, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Đơn hàng phải có ít nhất 1 sản phẩm' });
    }

    const normalizedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: Number(item.price),
      quantity: Number(item.quantity || 1),
    }));

    const totalAmount = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const normalizedPaymentMethod = paymentMethod === 'qr' ? 'qr' : 'cash';

    const order = await Order.create({
      customerName: customerName || 'Khách lẻ',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      customerAddress: customerAddress || '',
      totalAmount,
      status: normalizedPaymentMethod === 'qr' ? 'confirmed' : 'pending',
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: normalizedPaymentMethod === 'qr' ? 'paid' : 'pending',
      itemsJson: JSON.stringify(normalizedItems),
    });

    await CartItem.destroy({ where: {} });
    res.status(201).json(serializeOrder(order));
  } catch (err) {
    console.error('POST /api/orders error', err);
    res.status(500).json({ error: 'Lỗi khi tạo đơn hàng' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Đơn hàng không tồn tại' });

    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    await order.save();
    res.json(serializeOrder(order));
  } catch (err) {
    console.error('PUT /api/orders/:id error', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật đơn hàng' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', dialect: sequelize.getDialect() });
  } catch (err) {
    res.status(500).json({ status: 'fail', error: err.message });
  }
});

async function startServer() {
  try {
    await sequelize.sync({ alter: true });

    const users = await User.count();
    if (users === 0) {
      await User.bulkCreate([
        { name: 'Trương Hoàng Thái Thuận', email: 'thuanch@phonehub.com', role: 'Quản trị' },
        { name: 'Nguyễn Đức Quang', email: 'ducq@phonehub.com', role: 'Nhân viên bán hàng' },
        { name: 'Nguyễn Trần Quốc Quang', email: 'quangqt@phonehub.com', role: 'CSKH' },
        { name: 'Bùi Minh Nhật', email: 'nhatbm@phonehub.com', role: 'Giao nhận' },
        { name: 'Phạm Bảo Tâm', email: 'tampb@phonehub.com', role: 'Kiểm hàng' },
      ]);
      console.log('Seeded initial users');
    }

    const products = await Product.count();
    if (products === 0) {
      await Product.bulkCreate(defaultProducts);
      console.log('Seeded initial products');
    }

    app.listen(port, () => {
      console.log(`Backend server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Cannot start server', err);
  }
}

startServer();
