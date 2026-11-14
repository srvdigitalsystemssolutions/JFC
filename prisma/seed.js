const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding ---');

  // 1. Roles
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Full administrative access to all modules and configurations' },
    { name: 'CHEF', description: 'Kitchen Display System access to view and update food orders' },
    { name: 'BILLING_STAFF', description: 'Point of sale, table assignment, billing, and checkout access' },
    { name: 'CUSTOMER', description: 'Guest / customer website viewing and order placement' },
  ];

  const createdRoles = {};
  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r,
    });
    createdRoles[r.name] = role;
  }
  console.log('✓ Roles seeded');

  // 2. Permissions for SUPER_ADMIN
  const modules = [
    'DASHBOARD',
    'ANALYTICS',
    'MENU',
    'MENU_MASTER',
    'BILLING',
    'TABLES',
    'GALLERY',
    'TESTIMONIALS',
    'MESSAGES',
    'SETTINGS',
    'RBAC',
    'USERS',
  ];

  for (const mod of modules) {
    await prisma.permission.upsert({
      where: {
        roleId_module: {
          roleId: createdRoles['SUPER_ADMIN'].id,
          module: mod,
        },
      },
      update: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      create: {
        roleId: createdRoles['SUPER_ADMIN'].id,
        module: mod,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
    });

    // Default permissions for Billing Staff
    if (['DASHBOARD', 'BILLING', 'TABLES', 'MENU'].includes(mod)) {
      await prisma.permission.upsert({
        where: {
          roleId_module: {
            roleId: createdRoles['BILLING_STAFF'].id,
            module: mod,
          },
        },
        update: { canCreate: true, canRead: true, canUpdate: true, canDelete: false },
        create: {
          roleId: createdRoles['BILLING_STAFF'].id,
          module: mod,
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: false,
        },
      });
    }

    // Default permissions for Chef
    if (['DASHBOARD', 'MENU'].includes(mod)) {
      await prisma.permission.upsert({
        where: {
          roleId_module: {
            roleId: createdRoles['CHEF'].id,
            module: mod,
          },
        },
        update: { canCreate: false, canRead: true, canUpdate: true, canDelete: false },
        create: {
          roleId: createdRoles['CHEF'].id,
          module: mod,
          canCreate: false,
          canRead: true,
          canUpdate: true,
          canDelete: false,
        },
      });
    }
  }
  console.log('✓ RBAC Permissions seeded');

  // 3. Default Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const chefPassword = await bcrypt.hash('chef123', salt);
  const posPassword = await bcrypt.hash('pos123', salt);
  const userPassword = await bcrypt.hash('user123', salt);

  const defaultUsers = [
    {
      name: 'Alexander Wright (Super Admin)',
      email: 'admin@royalspice.com',
      password: adminPassword,
      phone: '+91 98765 00001',
      roleId: createdRoles['SUPER_ADMIN'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Chef Marco Pierre',
      email: 'chef@royalspice.com',
      password: chefPassword,
      phone: '+91 98765 00002',
      roleId: createdRoles['CHEF'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Sarah Connor (Cashier)',
      email: 'pos@royalspice.com',
      password: posPassword,
      phone: '+91 98765 00003',
      roleId: createdRoles['BILLING_STAFF'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Rahul Sharma (Guest)',
      email: 'john@example.com',
      password: userPassword,
      phone: '+91 98765 00004',
      roleId: createdRoles['CUSTOMER'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    },
  ];

  for (const u of defaultUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, status: u.status, roleId: u.roleId },
      create: u,
    });
  }
  console.log('✓ System Users seeded');

  // 4. Categories
  const categoriesData = [
    {
      name: 'Starters & Appetizers',
      slug: 'starters-appetizers',
      description: 'Crisp, spicy and sizzling delicacies to ignite your appetite',
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=400&q=80',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Main Course Specialties',
      slug: 'main-course-specialties',
      description: 'Rich slow-cooked gravies, royal curries and tandoori classics',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Artisan Breads & Rice',
      slug: 'artisan-breads-rice',
      description: 'Hand-stretched naans, fragrant basmati biryanis and pulao',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Desserts & Sweets',
      slug: 'desserts-sweets',
      description: 'Decadent royal treats, artisanal kulfis and hot halwas',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'Beverages & Mocktails',
      slug: 'beverages-mocktails',
      description: 'Chilled signature quenchers, fresh fruit coolers and lassis',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
      displayOrder: 5,
      isActive: true,
    },
  ];

  const createdCategories = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    createdCategories[cat.slug] = c;
  }
  console.log('✓ Categories seeded');

  // 5. Menu Items
  const menuItemsData = [
    {
      name: 'Paneer Tikka Angara',
      slug: 'paneer-tikka-angara',
      description: 'Cottage cheese marinated in Kashmiri chili and hung curd, roasted in clay oven.',
      price: 280,
      categoryId: createdCategories['starters-appetizers'].id,
      isVeg: true,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80',
      tags: 'Chef Special, Spicy, Tandoor',
      prepTime: 15,
    },
    {
      name: 'Murgh Malai Kebab',
      slug: 'murgh-malai-kebab',
      description: 'Melt-in-mouth chicken chunks infused with cream, cheese, and crushed cardamom.',
      price: 340,
      categoryId: createdCategories['starters-appetizers'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=400&q=80',
      tags: 'Best Seller, Mild, Clay Oven',
      prepTime: 18,
    },
    {
      name: 'Royal Butter Chicken',
      slug: 'royal-butter-chicken',
      description: 'Tender chicken braised in rich satin tomato and cashew butter gravy.',
      price: 390,
      categoryId: createdCategories['main-course-specialties'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80',
      tags: 'Signature, Creamy, Must Try',
      prepTime: 20,
    },
    {
      name: 'Dal Makhani Bukhara',
      slug: 'dal-makhani-bukhara',
      description: 'Black lentils slow-cooked overnight with churned butter and dried fenugreek.',
      price: 260,
      categoryId: createdCategories['main-course-specialties'].id,
      isVeg: true,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
      tags: 'Classic, Creamy',
      prepTime: 12,
    },
    {
      name: 'Dum Pukht Mutton Biryani',
      slug: 'dum-pukht-mutton-biryani',
      description: 'Aromatic long grain basmati steamed with tender spiced goat meat in sealed earthen pot.',
      price: 450,
      categoryId: createdCategories['artisan-breads-rice'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
      tags: 'Chef Special, Royal Dum, Spicy',
      prepTime: 25,
    },
    {
      name: 'Garlic Butter Naan',
      slug: 'garlic-butter-naan',
      description: 'Leavened bread baked on tandoor walls topped with minced garlic and coriander butter.',
      price: 75,
      categoryId: createdCategories['artisan-breads-rice'].id,
      isVeg: true,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&q=80',
      tags: 'Tandoor, Fresh',
      prepTime: 8,
    },
    {
      name: 'Saffron Gulab Jamun with Rabri',
      slug: 'saffron-gulab-jamun-rabri',
      description: 'Warm golden milk dumplings soaked in cardamom sugar syrup served on condensed milk bed.',
      price: 180,
      categoryId: createdCategories['desserts-sweets'].id,
      isVeg: true,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
      tags: 'Sweet, Royal Dessert',
      prepTime: 5,
    },
    {
      name: 'Royal Alfonso Mango Lassi',
      slug: 'royal-alfonso-mango-lassi',
      description: 'Velvety yogurt churned with Ratnagiri mango pulp and crushed pistachios.',
      price: 140,
      categoryId: createdCategories['beverages-mocktails'].id,
      isVeg: true,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=400&q=80',
      tags: 'Chilled, Refreshing',
      prepTime: 5,
    },
  ];

  const createdMenuItems = [];
  for (const item of menuItemsData) {
    const mi = await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
    createdMenuItems.push(mi);
  }
  console.log('✓ Menu Items seeded');

  // 6. Restaurant Tables
  const tablesData = [
    { tableNumber: 'T-01', capacity: 2, floorZone: 'Main Dining', status: 'AVAILABLE' },
    { tableNumber: 'T-02', capacity: 4, floorZone: 'Main Dining', status: 'OCCUPIED' },
    { tableNumber: 'T-03', capacity: 4, floorZone: 'Main Dining', status: 'AVAILABLE' },
    { tableNumber: 'T-04', capacity: 6, floorZone: 'Family Corner', status: 'AVAILABLE' },
    { tableNumber: 'T-05', capacity: 8, floorZone: 'VIP Lounge', status: 'RESERVED' },
    { tableNumber: 'T-06', capacity: 2, floorZone: 'Rooftop Deck', status: 'AVAILABLE' },
    { tableNumber: 'T-07', capacity: 4, floorZone: 'Rooftop Deck', status: 'OCCUPIED' },
    { tableNumber: 'T-08', capacity: 6, floorZone: 'Garden Terrace', status: 'AVAILABLE' },
  ];

  const createdTables = [];
  for (const t of tablesData) {
    const table = await prisma.restaurantTable.upsert({
      where: { tableNumber: t.tableNumber },
      update: t,
      create: { ...t, qrCodeToken: `QR-TABLE-${t.tableNumber}` },
    });
    createdTables.push(table);
  }
  console.log('✓ Tables seeded');

  // 7. Sample Orders & Bills for realistic Analytics
  const sampleOrder1 = await prisma.order.upsert({
    where: { orderNumber: 'ORD-1001' },
    update: {},
    create: {
      orderNumber: 'ORD-1001',
      tableId: createdTables[1].id, // T-02
      customerName: 'Kavita Patel',
      customerPhone: '+91 99887 76655',
      orderType: 'DINE_IN',
      status: 'PREPARING',
      specialInstructions: 'Make butter chicken medium spicy, no extra butter on naan.',
      subtotal: 730,
      taxAmount: 36.5,
      discountAmount: 0,
      totalAmount: 766.5,
      items: {
        create: [
          {
            menuItemId: createdMenuItems[2].id, // Butter Chicken
            quantity: 1,
            unitPrice: 390,
            totalPrice: 390,
            specialInstructions: 'Medium spicy',
            status: 'PREPARING',
          },
          {
            menuItemId: createdMenuItems[5].id, // Garlic Naan
            quantity: 2,
            unitPrice: 75,
            totalPrice: 150,
            status: 'PREPARING',
          },
          {
            menuItemId: createdMenuItems[6].id, // Gulab Jamun
            quantity: 1,
            unitPrice: 180,
            totalPrice: 180,
            status: 'PENDING',
          },
        ],
      },
    },
  });

  const sampleOrder2 = await prisma.order.upsert({
    where: { orderNumber: 'ORD-1000' },
    update: {},
    create: {
      orderNumber: 'ORD-1000',
      tableId: createdTables[6].id, // T-07
      customerName: 'David Miller',
      customerPhone: '+91 91234 56789',
      orderType: 'DINE_IN',
      status: 'COMPLETED',
      subtotal: 870,
      taxAmount: 43.5,
      discountAmount: 50,
      totalAmount: 863.5,
      items: {
        create: [
          {
            menuItemId: createdMenuItems[4].id, // Biryani
            quantity: 1,
            unitPrice: 450,
            totalPrice: 450,
            status: 'READY',
          },
          {
            menuItemId: createdMenuItems[0].id, // Paneer Tikka
            quantity: 1,
            unitPrice: 280,
            totalPrice: 280,
            status: 'READY',
          },
          {
            menuItemId: createdMenuItems[7].id, // Mango Lassi
            quantity: 1,
            unitPrice: 140,
            totalPrice: 140,
            status: 'READY',
          },
        ],
      },
    },
  });

  // Create Bill for Completed Order
  await prisma.bill.upsert({
    where: { invoiceNumber: 'INV-2026-001' },
    update: {},
    create: {
      invoiceNumber: 'INV-2026-001',
      orderId: sampleOrder2.id,
      tableId: createdTables[6].id,
      subtotal: 870,
      taxRate: 5.0,
      taxAmount: 43.5,
      discountType: 'FIXED',
      discountValue: 50,
      discountAmount: 50,
      grandTotal: 863.5,
      paymentStatus: 'PAID',
      payments: {
        create: {
          amount: 863.5,
          paymentMethod: 'UPI',
          transactionRef: 'UPI-REF-99281726',
          status: 'COMPLETED',
        },
      },
    },
  });
  console.log('✓ Sample Orders & Bills seeded');

  // 8. Gallery
  const galleryItems = [
    {
      title: 'Royal Ambience & Warm Chandeliers',
      category: 'Ambience',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      description: 'Our luxurious dining hall designed for unforgettable family evenings.',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      title: 'Tandoori Clay Oven Live Kitchen',
      category: 'Food',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      description: 'Master chefs baking artisanal breads and sizzling kebabs in real time.',
      isFeatured: true,
      displayOrder: 2,
    },
    {
      title: 'Open Sky Rooftop Dining',
      category: 'Interior',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      description: 'Stargazing terrace with candle-lit tables and panoramic city views.',
      isFeatured: true,
      displayOrder: 3,
    },
  ];

  for (const g of galleryItems) {
    const existing = await prisma.gallery.findFirst({ where: { title: g.title } });
    if (!existing) {
      await prisma.gallery.create({ data: g });
    }
  }
  console.log('✓ Gallery seeded');

  // 9. Testimonials
  const testimonialsData = [
    {
      customerName: 'Aarav Malhotra',
      customerRole: 'Food Critic & Blogger',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      rating: 5,
      content: 'The Dal Makhani and Butter Chicken here set a benchmark in authentic culinary excellence. Absolutely phenomenal dining experience!',
      isApproved: true,
    },
    {
      customerName: 'Meera Sengupta',
      customerRole: 'Regular Diner',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      rating: 5,
      content: 'Incredible hospitality! We celebrated our 10th anniversary on the rooftop deck, and the staff made it truly magical.',
      isApproved: true,
    },
    {
      customerName: 'Robert Vance',
      customerRole: 'Tourist from London',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      rating: 4,
      content: 'One of the best Indian dining places I have experienced across the globe. Fast service and stunning flavors.',
      isApproved: true,
    },
  ];

  for (const t of testimonialsData) {
    const existing = await prisma.testimonial.findFirst({ where: { customerName: t.customerName } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log('✓ Testimonials seeded');

  // 10. Contact Messages
  const messagesData = [
    {
      name: 'Pooja Verma',
      email: 'pooja.v@example.com',
      phone: '+91 98980 11223',
      subject: 'Table Reservation for 20 Pax (Corporate Dinner)',
      message: 'Hi team, we are planning our annual corporate get-together next Friday for around 20 guests. Do you have a set banquet menu option?',
      status: 'UNREAD',
    },
    {
      name: 'Rohan Mehra',
      email: 'rohan.m@example.com',
      phone: '+91 97766 55443',
      subject: 'Private Terrace Booking Enquiry',
      message: 'Looking to book the terrace floor for a private birthday party on Sunday. Please connect with package details.',
      status: 'READ',
    },
  ];

  for (const m of messagesData) {
    const existing = await prisma.message.findFirst({ where: { email: m.email, subject: m.subject } });
    if (!existing) {
      await prisma.message.create({ data: m });
    }
  }
  console.log('✓ Contact Messages seeded');

  // 11. Restaurant Settings
  await prisma.setting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      restaurantName: 'Royal Spice Grand Restaurant & Bar',
      tagLine: 'Authentic Flavours, Luxury Dining',
      logo: '/images/logo.png',
      address: '42 Gourmet Avenue, Culinary District, Metro City, 400001',
      phone: '+91 98765 43210',
      email: 'contact@royalspice.com',
      openingHours: 'Mon - Sun: 11:00 AM - 11:30 PM',
      currency: 'INR',
      currencySymbol: '₹',
      taxRate: 5.0,
      taxNumber: 'GSTIN33AABCT9988D1Z9',
      websiteUrl: 'https://royalspice.com',
      facebookUrl: 'https://facebook.com/royalspice',
      instagramUrl: 'https://instagram.com/royalspice',
      twitterUrl: 'https://twitter.com/royalspice',
    },
  });
  console.log('✓ Settings seeded');

  console.log('--- Database Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
