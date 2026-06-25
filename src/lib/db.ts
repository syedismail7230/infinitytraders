import fs from 'fs';
import path from 'path';

// Define DB paths
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Interface Definitions
export interface Product {
  id: string;
  sku: string;
  brand: string;
  category: string; // 'Footwear' | 'Slippers' | 'Apparel' | 'Accessories'
  name: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  stockQuantity: number;
  color: string;
  material: string;
  width: string; // 'Standard' | 'Wide' | 'Narrow'
  sizes: number[]; // Indian Sizes, e.g. [6, 7, 8, 9, 10, 11]
  images: string[];
  videos?: string[];
  seoTitle?: string;
  seoDescription?: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  averageRating: number;
  reviewsCount: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  categoryRestriction?: string;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  quantity: number;
  size: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  orderValue: number; // Subtotal before GST and shipping
  gstAmount: number; // 18% CGST + SGST combined
  shippingCharges: number;
  couponApplied?: string;
  finalAmount: number;
  paymentMethod: 'COD' | 'RAZORPAY';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PENDING' | 'DISPATCHED' | 'DELIVERED' | 'RETURNED';
  courierName?: string;
  trackingNumber?: string;
  dispatchDetails?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  mobile: string;
  passwordHash: string; // For mock, direct comparison or basic hash
  name: string;
  role: 'SUPER_ADMIN' | 'STORE_MANAGER' | 'MARKETING_MANAGER' | 'CUSTOMER_SUPPORT' | 'CUSTOMER';
  addresses: Array<{
    id: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>;
  wishlist: string[]; // Product IDs
  recentlyViewed: string[]; // Product IDs
  createdAt: string;
}

export interface PincodeServiceability {
  pincode: string;
  serviceable: boolean;
  estimatedDays: number;
  state: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  products: Product[];
  coupons: Coupon[];
  orders: Order[];
  users: User[];
  pincodes: PincodeServiceability[];
  auditLogs: AuditLog[];
  settings: {
    standardShippingFee: number;
    freeShippingThreshold: number;
  };
}

// Initial Mock Seed Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    sku: 'NK-AZM-01',
    brand: 'Nike',
    category: 'Footwear',
    name: 'Air Zoom Pegasus Running Shoe',
    description: 'Featuring a responsive zoom air unit and a highly breathable engineering mesh upper. Engineered to support your active stride with premium lightweight cushioning.',
    mrp: 12999,
    sellingPrice: 9999,
    discountPercentage: 23,
    stockQuantity: 45,
    color: 'Crimson Red',
    material: 'Tech Mesh & EVA Foam',
    width: 'Standard',
    sizes: [7, 8, 9, 10, 11],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
    ],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    averageRating: 4.8,
    reviewsCount: 34
  },
  {
    id: 'prod_2',
    sku: 'AD-SLD-02',
    brand: 'Adidas',
    category: 'Slippers',
    name: 'Adilette Comfort Slides',
    description: 'Classic lightweight sliders featuring a contoured footbed and quick-drying bandage upper. Perfect recovery footwear after an intense workout session.',
    mrp: 2999,
    sellingPrice: 1999,
    discountPercentage: 33,
    stockQuantity: 120,
    color: 'Core Black',
    material: 'Recycled EVA Foam',
    width: 'Standard',
    sizes: [6, 7, 8, 9, 10, 11],
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80'
    ],
    isNewArrival: true,
    isBestSeller: false,
    isTrending: true,
    averageRating: 4.5,
    reviewsCount: 89
  },
  {
    id: 'prod_3',
    sku: 'PM-TR-03',
    brand: 'Puma',
    category: 'Apparel',
    name: 'Active Tech Fleece Trousers',
    description: 'Designed with warm tech fleece material and tapered cuffs. These training trousers offer excellent warmth and mobility without adding extra bulk.',
    mrp: 3999,
    sellingPrice: 2799,
    discountPercentage: 30,
    stockQuantity: 50,
    color: 'Charcoal Grey',
    material: 'Fleece Knit Polyester',
    width: 'Standard',
    sizes: [30, 32, 34, 36],
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80'
    ],
    isNewArrival: false,
    isBestSeller: true,
    isTrending: false,
    averageRating: 4.7,
    reviewsCount: 22
  },
  {
    id: 'prod_4',
    sku: 'SK-TEE-04',
    brand: 'Skechers',
    category: 'Apparel',
    name: 'GO RUN Breathable Training Tee',
    description: 'A breathable, lightweight t-shirt built for running. Features high stretch and sweat-wicking properties to keep you cool and dry.',
    mrp: 2499,
    sellingPrice: 1699,
    discountPercentage: 32,
    stockQuantity: 65,
    color: 'Slate Blue',
    material: 'Poly-Spandex Tech Mesh',
    width: 'Standard',
    sizes: [38, 40, 42, 44],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
    ],
    isNewArrival: true,
    isBestSeller: false,
    isTrending: true,
    averageRating: 4.6,
    reviewsCount: 15
  },
  {
    id: 'prod_5',
    sku: 'RB-SOX-05',
    brand: 'Reebok',
    category: 'Accessories',
    name: 'Cushioned Crew Athletic Socks',
    description: 'Pack of 3 premium combed cotton athletic socks. Full foot cushioning provides impact absorption and blister protection.',
    mrp: 999,
    sellingPrice: 599,
    discountPercentage: 40,
    stockQuantity: 80,
    color: 'White / Grey',
    material: 'Premium Combed Cotton',
    width: 'Standard',
    sizes: [0],
    images: [
      'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=600&q=80'
    ],
    isNewArrival: false,
    isBestSeller: true,
    isTrending: true,
    averageRating: 4.7,
    reviewsCount: 45
  },
  {
    id: 'prod_6',
    sku: 'NK-SHR-06',
    brand: 'Nike',
    category: 'Apparel',
    name: 'Dri-FIT Flex Training Shorts',
    description: 'High-performance training shorts featuring Nike Dri-FIT technology. Provides absolute flexibility, sweat management, and a comfortable secure fit.',
    mrp: 2199,
    sellingPrice: 1499,
    discountPercentage: 31,
    stockQuantity: 90,
    color: 'Black / Metallic',
    material: 'Recycled Polyester',
    width: 'Standard',
    sizes: [30, 32, 34, 36],
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80'
    ],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: false,
    averageRating: 4.8,
    reviewsCount: 19
  },
  {
    id: 'prod_7',
    sku: 'AD-KIT-07',
    brand: 'Adidas',
    category: 'Apparel',
    name: 'Primeknit Running Kit',
    description: 'Complete high-performance training bundle comprising premium running compression pants and a cooling active sando vest.',
    mrp: 5999,
    sellingPrice: 4499,
    discountPercentage: 25,
    stockQuantity: 30,
    color: 'Black Accent',
    material: 'Primeknit Seamless fabric',
    width: 'Standard',
    sizes: [38, 40, 42, 44],
    images: [
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=600&q=80'
    ],
    isNewArrival: true,
    isBestSeller: false,
    isTrending: true,
    averageRating: 4.7,
    reviewsCount: 12
  },
  {
    id: 'prod_8',
    sku: 'PM-JER-08',
    brand: 'Puma',
    category: 'Apparel',
    name: 'Striker Football Active Jersey',
    description: 'DryCELL sweat-wicking lightweight football jersey. Styled with club details, high ventilation zones, and ergonomic lines.',
    mrp: 2799,
    sellingPrice: 1899,
    discountPercentage: 32,
    stockQuantity: 40,
    color: 'Red / White',
    material: 'DryCELL Polyester Knit',
    width: 'Standard',
    sizes: [38, 40, 42, 44],
    images: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'
    ],
    isNewArrival: false,
    isBestSeller: true,
    isTrending: true,
    averageRating: 4.6,
    reviewsCount: 28
  },
  {
    id: 'prod_9',
    sku: 'RB-CLN-09',
    brand: 'Reebok',
    category: 'Accessories',
    name: 'Ultimate Shoe Cleaner Kit',
    description: 'All-in-one athletic shoe care cleaner. Comes with a foaming cleaning solution, a premium soft hog bristle brush, and a microfiber cloth.',
    mrp: 1499,
    sellingPrice: 999,
    discountPercentage: 33,
    stockQuantity: 15,
    color: 'Clear / White',
    material: 'Natural Cleaning Solution',
    width: 'Standard',
    sizes: [0],
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80'
    ],
    isNewArrival: true,
    isBestSeller: false,
    isTrending: false,
    averageRating: 4.4,
    reviewsCount: 30
  }
];

const INITIAL_COUPONS: Coupon[] = [
  { id: 'c_1', code: 'INFINITY10', discountType: 'PERCENTAGE', discountValue: 10, minOrderValue: 999, isActive: true },
  { id: 'c_2', code: 'FIRSTBUY300', discountType: 'FIXED', discountValue: 300, minOrderValue: 1999, isActive: true },
  { id: 'c_3', code: 'FESTIVE500', discountType: 'FIXED', discountValue: 500, minOrderValue: 2999, isActive: true }
];

const INITIAL_PINCODES: PincodeServiceability[] = [
  { pincode: '826001', serviceable: true, estimatedDays: 2, state: 'Jharkhand' }, // Dhanbad HQ
  { pincode: '826002', serviceable: true, estimatedDays: 2, state: 'Jharkhand' },
  { pincode: '828111', serviceable: true, estimatedDays: 3, state: 'Jharkhand' },
  { pincode: '110001', serviceable: true, estimatedDays: 4, state: 'Delhi' },
  { pincode: '400001', serviceable: true, estimatedDays: 4, state: 'Maharashtra' },
  { pincode: '700001', serviceable: true, estimatedDays: 3, state: 'West Bengal' },
  { pincode: '560001', serviceable: true, estimatedDays: 5, state: 'Karnataka' },
  { pincode: '600001', serviceable: true, estimatedDays: 5, state: 'Tamil Nadu' }
];

const INITIAL_USERS: User[] = [
  {
    id: 'u_1',
    email: 'admin@infinitytraders.com',
    mobile: '9999999999',
    passwordHash: 'admin123', // Demo simplified pwd
    name: 'Super Admin',
    role: 'SUPER_ADMIN',
    addresses: [
      { id: 'addr_1', street: 'Infinity HQ, Bank More', city: 'Dhanbad', state: 'Jharkhand', pincode: '826001', isDefault: true }
    ],
    wishlist: [],
    recentlyViewed: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'u_2',
    email: 'manager@infinitytraders.com',
    mobile: '8888888888',
    passwordHash: 'manager123',
    name: 'Store Manager',
    role: 'STORE_MANAGER',
    addresses: [],
    wishlist: [],
    recentlyViewed: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'u_3',
    email: 'marketing@infinitytraders.com',
    mobile: '7777777777',
    passwordHash: 'market123',
    name: 'Marketing Head',
    role: 'MARKETING_MANAGER',
    addresses: [],
    wishlist: [],
    recentlyViewed: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'u_4',
    email: 'demo@customer.com',
    mobile: '9876543210',
    passwordHash: 'customer123',
    name: 'Rohan Sharma',
    role: 'CUSTOMER',
    addresses: [
      { id: 'addr_2', street: 'Flat 402, Royal Residency, Bank More', city: 'Dhanbad', state: 'Jharkhand', pincode: '826001', isDefault: true },
      { id: 'addr_3', street: '12, Park Street', city: 'Kolkata', state: 'West Bengal', pincode: '700016', isDefault: false }
    ],
    wishlist: ['prod_1', 'prod_3'],
    recentlyViewed: ['prod_1', 'prod_2', 'prod_3'],
    createdAt: new Date().toISOString()
  }
];

// Helper to check and load data
function getDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const defaultData: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      coupons: INITIAL_COUPONS,
      orders: [],
      users: INITIAL_USERS,
      pincodes: INITIAL_PINCODES,
      auditLogs: [
        {
          id: 'log_1',
          userId: 'u_1',
          userEmail: 'admin@infinitytraders.com',
          action: 'DB_INITIALIZATION',
          details: 'Database seeded with default products, users, and pincodes.',
          timestamp: new Date().toISOString()
        }
      ],
      settings: {
        standardShippingFee: 99,
        freeShippingThreshold: 999
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error('Error reading JSON database, resetting. Error:', error);
    // Return initial to prevent crash, write back
    const defaultData: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      coupons: INITIAL_COUPONS,
      orders: [],
      users: INITIAL_USERS,
      pincodes: INITIAL_PINCODES,
      auditLogs: [],
      settings: {
        standardShippingFee: 99,
        freeShippingThreshold: 999
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
}

function saveDatabase(db: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

export const db = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    const db = getDatabase();
    return db.products;
  },

  async getProductById(id: string): Promise<Product | null> {
    const db = getDatabase();
    return db.products.find(p => p.id === id) || null;
  },

  async createProduct(product: Omit<Product, 'id' | 'averageRating' | 'reviewsCount'>): Promise<Product> {
    const db = getDatabase();
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      averageRating: 5.0,
      reviewsCount: 0
    };
    db.products.push(newProduct);
    saveDatabase(db);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const db = getDatabase();
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    db.products[index] = { ...db.products[index], ...updates };
    saveDatabase(db);
    return db.products[index];
  },

  async deleteProduct(id: string): Promise<boolean> {
    const db = getDatabase();
    const len = db.products.length;
    db.products = db.products.filter(p => p.id !== id);
    if (db.products.length === len) return false;
    saveDatabase(db);
    return true;
  },

  // USERS
  async getUsers(): Promise<User[]> {
    const db = getDatabase();
    return db.users;
  },

  async getUserById(id: string): Promise<User | null> {
    const db = getDatabase();
    return db.users.find(u => u.id === id) || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const db = getDatabase();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUserByMobile(mobile: string): Promise<User | null> {
    const db = getDatabase();
    return db.users.find(u => u.mobile === mobile) || null;
  },

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'addresses' | 'wishlist' | 'recentlyViewed'>): Promise<User> {
    const db = getDatabase();
    const newUser: User = {
      ...user,
      id: `u_${Date.now()}`,
      addresses: [],
      wishlist: [],
      recentlyViewed: [],
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDatabase(db);
    return newUser;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const db = getDatabase();
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    db.users[index] = { ...db.users[index], ...updates };
    saveDatabase(db);
    return db.users[index];
  },

  // COUPONS
  async getCoupons(): Promise<Coupon[]> {
    const db = getDatabase();
    return db.coupons;
  },

  async getCouponByCode(code: string): Promise<Coupon | null> {
    const db = getDatabase();
    return db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive) || null;
  },

  async createCoupon(coupon: Omit<Coupon, 'id'>): Promise<Coupon> {
    const db = getDatabase();
    const newCoupon: Coupon = {
      ...coupon,
      id: `c_${Date.now()}`
    };
    db.coupons.push(newCoupon);
    saveDatabase(db);
    return newCoupon;
  },

  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon | null> {
    const db = getDatabase();
    const index = db.coupons.findIndex(c => c.id === id);
    if (index === -1) return null;
    db.coupons[index] = { ...db.coupons[index], ...updates };
    saveDatabase(db);
    return db.coupons[index];
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const db = getDatabase();
    const len = db.coupons.length;
    db.coupons = db.coupons.filter(c => c.id !== id);
    if (db.coupons.length === len) return false;
    saveDatabase(db);
    return true;
  },

  // PINCODES
  async checkPincode(pincode: string): Promise<PincodeServiceability | null> {
    const db = getDatabase();
    return db.pincodes.find(p => p.pincode === pincode) || null;
  },

  async getPincodes(): Promise<PincodeServiceability[]> {
    const db = getDatabase();
    return db.pincodes;
  },

  async addOrUpdatePincode(pincode: string, serviceability: Omit<PincodeServiceability, 'pincode'>): Promise<PincodeServiceability> {
    const db = getDatabase();
    const index = db.pincodes.findIndex(p => p.pincode === pincode);
    const item = { pincode, ...serviceability };
    if (index === -1) {
      db.pincodes.push(item);
    } else {
      db.pincodes[index] = item;
    }
    saveDatabase(db);
    return item;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    const db = getDatabase();
    return db.orders;
  },

  async getOrderById(id: string): Promise<Order | null> {
    const db = getDatabase();
    return db.orders.find(o => o.id === id) || null;
  },

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'orderStatus' | 'paymentStatus'>): Promise<Order> {
    const db = getDatabase();
    const newOrder: Order = {
      ...orderData,
      id: `ORD_${Date.now()}`,
      orderStatus: 'PENDING',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'PENDING' : 'PAID', // Simulating Razorpay paid immediately
      createdAt: new Date().toISOString()
    };

    // Deduct inventory stock
    for (const item of newOrder.items) {
      const productIndex = db.products.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        db.products[productIndex].stockQuantity = Math.max(0, db.products[productIndex].stockQuantity - item.quantity);
      }
    }

    db.orders.push(newOrder);
    saveDatabase(db);
    return newOrder;
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const db = getDatabase();
    const index = db.orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    db.orders[index] = { ...db.orders[index], ...updates };
    saveDatabase(db);
    return db.orders[index];
  },

  // SETTINGS
  async getSettings(): Promise<{ standardShippingFee: number; freeShippingThreshold: number }> {
    const db = getDatabase();
    return db.settings;
  },

  async updateSettings(updates: Partial<{ standardShippingFee: number; freeShippingThreshold: number }>): Promise<any> {
    const db = getDatabase();
    db.settings = { ...db.settings, ...updates };
    saveDatabase(db);
    return db.settings;
  },

  // AUDIT LOGS
  async getAuditLogs(): Promise<AuditLog[]> {
    const db = getDatabase();
    return db.auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async createAuditLog(userId: string, userEmail: string, action: string, details: string): Promise<AuditLog> {
    const db = getDatabase();
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      userId,
      userEmail,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    db.auditLogs.push(newLog);
    saveDatabase(db);
    return newLog;
  }
};
