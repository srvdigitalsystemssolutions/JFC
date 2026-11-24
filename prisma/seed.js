const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Johnson Food Court (JFC) Database ---');

  // 1. Roles
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Full administrative access to all modules and configurations' },
    { name: 'CHEF', description: 'Kitchen Display System access to view and update food orders' },
    { name: 'BILLING_STAFF', description: 'Point of sale, table assignment, billing, and checkout access' },
    { name: 'WAITER', description: 'Floor steward table management, status updates and KOT order dispatch' },
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

    // Default permissions for Waiter
    if (['DASHBOARD', 'TABLES', 'MENU'].includes(mod)) {
      await prisma.permission.upsert({
        where: {
          roleId_module: {
            roleId: createdRoles['WAITER'].id,
            module: mod,
          },
        },
        update: { canCreate: true, canRead: true, canUpdate: true, canDelete: false },
        create: {
          roleId: createdRoles['WAITER'].id,
          module: mod,
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: false,
        },
      });
    }
  }
  console.log('✓ RBAC Permissions seeded');

  // 3. System Users (Providing both @johnsonfoodcourt.com and @royalspice.com for backwards testing compatibility)
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const chefPassword = await bcrypt.hash('chef123', salt);
  const posPassword = await bcrypt.hash('pos123', salt);
  const waiterPassword = await bcrypt.hash('waiter123', salt);
  const userPassword = await bcrypt.hash('user123', salt);

  const defaultUsers = [
    // Primary Johnson Food Court Accounts
    {
      name: 'Johnson (General Manager)',
      email: 'admin@johnsonfoodcourt.com',
      password: adminPassword,
      phone: '+91 99652 78872',
      roleId: createdRoles['SUPER_ADMIN'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Chef Murugan (Head Chef)',
      email: 'chef@johnsonfoodcourt.com',
      password: chefPassword,
      phone: '+91 99652 78873',
      roleId: createdRoles['CHEF'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Praveen Kumar (Cashier)',
      email: 'pos@johnsonfoodcourt.com',
      password: posPassword,
      phone: '+91 99652 78874',
      roleId: createdRoles['BILLING_STAFF'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Karthik (Floor Steward)',
      email: 'waiter@johnsonfoodcourt.com',
      password: waiterPassword,
      phone: '+91 99652 78875',
      roleId: createdRoles['WAITER'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    },
    // Backwards compatibility accounts for quick access
    {
      name: 'Johnson Admin (Super Admin)',
      email: 'admin@royalspice.com',
      password: adminPassword,
      phone: '+91 99652 78872',
      roleId: createdRoles['SUPER_ADMIN'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Head Chef KDS',
      email: 'chef@royalspice.com',
      password: chefPassword,
      phone: '+91 99652 78873',
      roleId: createdRoles['CHEF'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'JFC Billing Cashier',
      email: 'pos@royalspice.com',
      password: posPassword,
      phone: '+91 99652 78874',
      roleId: createdRoles['BILLING_STAFF'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Floor Steward',
      email: 'waiter@royalspice.com',
      password: waiterPassword,
      phone: '+91 99652 78875',
      roleId: createdRoles['WAITER'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Vellore Guest Diner',
      email: 'john@example.com',
      password: userPassword,
      phone: '+91 98401 23456',
      roleId: createdRoles['CUSTOMER'].id,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    },
  ];

  for (const u of defaultUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, status: u.status, roleId: u.roleId, password: u.password, phone: u.phone },
      create: u,
    });
  }
  console.log('✓ System Users seeded');

  // 4. Categories for Johnson Food Court (JFC)
  const categoriesData = [
    {
      name: 'Shawarma & Rolls',
      slug: 'shawarma-rolls',
      description: 'Signature juicy spit-roasted chicken shawarma rolls and kuboos platters',
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=600&q=80',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Charcoal BBQ & Grills',
      slug: 'charcoal-bbq-grills',
      description: 'Smokey open-air charcoal tandoori, alfaham chicken and sizzling kebabs',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Fast Food & Starters',
      slug: 'fast-food-starters',
      description: 'Crispy honey chilli chicken, chicken lollipops, crunchy wings & finger bites',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Biryani & Rice Bowls',
      slug: 'biryani-rice-bowls',
      description: 'Fragrant seeraga samba & basmati dum biryani with raita and spicy dalcha',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'Chinese & Wok Specials',
      slug: 'chinese-wok-specials',
      description: 'Wok-tossed chicken fried rice, spicy Schezwan noodles, and dragon chicken',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
      displayOrder: 5,
      isActive: true,
    },
    {
      name: 'South Indian Parotta & Tiffin',
      slug: 'parotta-tiffin',
      description: 'Fluffy Malabar bun parottas, chicken kothu parotta & tandoori naans',
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
      displayOrder: 6,
      isActive: true,
    },
    {
      name: 'Burgers & Sandwiches',
      slug: 'burgers-sandwiches',
      description: 'JFC crispy zinger burgers, cheesy loaded fries & triple-decker club sandwiches',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      displayOrder: 7,
      isActive: true,
    },
    {
      name: 'Juices, Shakes & Mojitos',
      slug: 'juices-shakes-mojitos',
      description: 'Tender coconut falooda, mango shakes, blue curacao mojitos & fresh lime sodas',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      displayOrder: 8,
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

  // 5. Authentic Menu Items of Johnson Food Court (JFC)
  const menuItemsData = [
    // Shawarma
    {
      name: 'JFC Special Rumali Shawarma Roll',
      slug: 'jfc-special-rumali-shawarma',
      description: 'Slow-roasted succulent shredded chicken wrapped in soft rumali roti with signature garlic toum and pickles.',
      price: 130,
      categoryId: createdCategories['shawarma-rolls'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=600&q=80',
      tags: 'Crowd Favorite, Best Seller, JFC Special',
      prepTime: 8,
    },
    {
      name: 'Plate Shawarma with Fresh Kuboos',
      slug: 'plate-shawarma-kuboos',
      description: 'Generous serving of spiced shredded chicken, garlic sauce, french fries, hummus, and 2 fresh warm kuboos.',
      price: 170,
      categoryId: createdCategories['shawarma-rolls'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=600&q=80',
      tags: 'Hearty Portion, Signature',
      prepTime: 10,
    },
    {
      name: 'Peri Peri Spiced Chicken Shawarma',
      slug: 'peri-peri-chicken-shawarma',
      description: 'Signature shawarma infused with fiery African peri-peri glaze, jalapeños, and crunchy lettuce.',
      price: 140,
      categoryId: createdCategories['shawarma-rolls'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80',
      tags: 'Spicy, Must Try',
      prepTime: 8,
    },

    // Charcoal BBQ & Grills
    {
      name: 'Charcoal Tandoori Chicken (Half)',
      slug: 'charcoal-tandoori-chicken-half',
      description: 'Juicy chicken leg and breast marinated overnight in hung curd and aromatic spices, roasted in clay oven.',
      price: 240,
      categoryId: createdCategories['charcoal-bbq-grills'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      tags: 'Smokey, Chef Special, Clay Oven',
      prepTime: 18,
    },
    {
      name: 'Smokey BBQ Chicken (Full Portion)',
      slug: 'smokey-bbq-chicken-full',
      description: 'Tender chicken char-grilled on open grates and brushed generously with hickory smoked barbecue sauce.',
      price: 450,
      categoryId: createdCategories['charcoal-bbq-grills'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      tags: 'Best Seller, BBQ',
      prepTime: 20,
    },
    {
      name: 'Paneer Tikka Angara',
      slug: 'paneer-tikka-angara',
      description: 'Fresh malai paneer cubes marinated in Kashmiri deghi mirch and mustard oil, char-grilled with capsicum & onion.',
      price: 220,
      categoryId: createdCategories['charcoal-bbq-grills'].id,
      isVeg: true,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
      tags: 'Vegetarian, Tandoor',
      prepTime: 15,
    },

    // Fast Food & Starters
    {
      name: 'Honey Chilli Chicken (Crowd Favorite)',
      slug: 'honey-chilli-chicken',
      description: 'Crispy batter-fried chicken chunks glazed in sweet honey, roasted dry red chillies, and toasted sesame seeds.',
      price: 210,
      categoryId: createdCategories['fast-food-starters'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1527477378379-fed450bbca74?auto=format&fit=crop&w=600&q=80',
      tags: 'Crowd Favorite, Sweet & Spicy, Highly Rated',
      prepTime: 14,
    },
    {
      name: 'Crispy Chicken Lollipop (6 Pcs)',
      slug: 'crispy-chicken-lollipop',
      description: 'Classic Frenched chicken winglets marinated in ginger-garlic-chilli batter, deep fried and served with hot garlic dip.',
      price: 190,
      categoryId: createdCategories['fast-food-starters'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
      tags: 'Crispy, Starter',
      prepTime: 12,
    },
    {
      name: 'JFC Dragon Chicken',
      slug: 'jfc-dragon-chicken',
      description: 'Crispy chicken strips tossed in a fiery Indo-Chinese red sauce with cashew nuts, bell peppers, and scallions.',
      price: 220,
      categoryId: createdCategories['fast-food-starters'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
      tags: 'Spicy, Chef Special',
      prepTime: 15,
    },

    // Biryani & Rice
    {
      name: 'Ambur Special Chicken Dum Biryani',
      slug: 'ambur-chicken-dum-biryani',
      description: 'Authentic local Vellore-Ambur style Seeraga Samba rice dum biryani cooked with succulent chicken, curd & whole spices.',
      price: 210,
      categoryId: createdCategories['biryani-rice-bowls'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      tags: 'Vellore Special, Seeraga Samba, Dum Cooked',
      prepTime: 12,
    },
    {
      name: 'Chicken 65 Dum Biryani',
      slug: 'chicken-65-biryani',
      description: 'Flavorful spiced biryani rice topped with freshly fried boneless Chicken 65 chunks and boiled egg.',
      price: 240,
      categoryId: createdCategories['biryani-rice-bowls'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
      tags: 'Best Seller, Boneless',
      prepTime: 10,
    },

    // Chinese & Wok
    {
      name: 'Chicken Schezwan Fried Rice',
      slug: 'chicken-schezwan-fried-rice',
      description: 'Wok-tossed long grain rice with shredded chicken, scrambled eggs, spring onions, and spicy house Schezwan chili paste.',
      price: 180,
      categoryId: createdCategories['chinese-wok-specials'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
      tags: 'Wok Sizzler, Spicy',
      prepTime: 12,
    },
    {
      name: 'Chicken Hakka Noodles',
      slug: 'chicken-hakka-noodles',
      description: 'Thin egg noodles tossed with shredded chicken, crunchy carrots, cabbage, capsicum, and light soya sauce.',
      price: 170,
      categoryId: createdCategories['chinese-wok-specials'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
      tags: 'Quick Bite, Classic',
      prepTime: 12,
    },

    // Parotta & South Indian Breads
    {
      name: 'Malabar Bun Parotta (2 Pcs)',
      slug: 'malabar-bun-parotta-2pcs',
      description: 'Crisp, golden spiral-layered fluffy bun parottas served with rich spicy chicken salna or veg kurma.',
      price: 60,
      categoryId: createdCategories['parotta-tiffin'].id,
      isVeg: true,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
      tags: 'Fluffy, South Special',
      prepTime: 8,
    },
    {
      name: 'Chicken Kothu Parotta',
      slug: 'chicken-kothu-parotta',
      description: 'Street-style shredded parotta minced on hot iron griddle with tender chicken, eggs, green chillies, and aromatic salna.',
      price: 180,
      categoryId: createdCategories['parotta-tiffin'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      tags: 'Street Food Icon, Spicy',
      prepTime: 12,
    },

    // Burgers & Sandwiches
    {
      name: 'JFC Crispy Zinger Burger',
      slug: 'jfc-crispy-zinger-burger',
      description: 'Thick crunchy fried chicken fillet with creamy mayonnaise, fresh iceberg lettuce, and cheese inside toasted sesame bun.',
      price: 140,
      categoryId: createdCategories['burgers-sandwiches'].id,
      isVeg: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      tags: 'Crispy, Cheesy',
      prepTime: 10,
    },

    // Beverages & Coolers
    {
      name: 'Tender Coconut Special Falooda',
      slug: 'tender-coconut-falooda',
      description: 'Cooling dessert beverage crafted with fresh tender coconut water & pulp, sabja seeds, rose syrup, and vanilla scoop.',
      price: 140,
      categoryId: createdCategories['juices-shakes-mojitos'].id,
      isVeg: true,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      tags: 'Refreshing, Dessert Shake',
      prepTime: 6,
    },
    {
      name: 'Blue Curacao Mint Mojito',
      slug: 'blue-curacao-mint-mojito',
      description: 'Zesty blend of crushed fresh garden mint, Persian lime juice, blue curacao cordial, and fizzy sparkling soda.',
      price: 99,
      categoryId: createdCategories['juices-shakes-mojitos'].id,
      isVeg: true,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      tags: 'Chilled, Fizz Mocktail',
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

  // 6. Restaurant Tables (Outdoor Garden & Food Court Zones)
  const tablesData = [
    { tableNumber: 'T-01', capacity: 2, floorZone: 'Open-Air Garden Lawn', status: 'AVAILABLE' },
    { tableNumber: 'T-02', capacity: 4, floorZone: 'Open-Air Garden Lawn', status: 'OCCUPIED' },
    { tableNumber: 'T-03', capacity: 4, floorZone: 'Open-Air Garden Lawn', status: 'AVAILABLE' },
    { tableNumber: 'T-04', capacity: 6, floorZone: 'Main Food Court Pavilion', status: 'AVAILABLE' },
    { tableNumber: 'T-05', capacity: 8, floorZone: 'Main Food Court Pavilion', status: 'RESERVED' },
    { tableNumber: 'T-06', capacity: 2, floorZone: 'Family Canopy', status: 'AVAILABLE' },
    { tableNumber: 'T-07', capacity: 4, floorZone: 'Family Canopy', status: 'OCCUPIED' },
    { tableNumber: 'T-08', capacity: 6, floorZone: 'Rooftop Deck', status: 'AVAILABLE' },
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

  // 7. Sample Orders & Invoices for JFC
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
      specialInstructions: 'Make Shawarma extra spicy with garlic mayo on side.',
      subtotal: 510,
      taxAmount: 25.5,
      discountAmount: 0,
      totalAmount: 535.5,
      items: {
        create: [
          {
            menuItemId: createdMenuItems[0].id, // Rumali Shawarma
            quantity: 2,
            unitPrice: 130,
            totalPrice: 260,
            specialInstructions: 'Extra garlic mayo',
            status: 'PREPARING',
          },
          {
            menuItemId: createdMenuItems[6].id, // Honey Chilli Chicken
            quantity: 1,
            unitPrice: 210,
            totalPrice: 210,
            status: 'PREPARING',
          },
          {
            menuItemId: createdMenuItems[17].id, // Mojito
            quantity: 1,
            unitPrice: 99,
            totalPrice: 99,
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
      subtotal: 780,
      taxAmount: 39.0,
      discountAmount: 50,
      totalAmount: 769.0,
      items: {
        create: [
          {
            menuItemId: createdMenuItems[9].id, // Ambur Biryani
            quantity: 2,
            unitPrice: 210,
            totalPrice: 420,
            status: 'READY',
          },
          {
            menuItemId: createdMenuItems[3].id, // Tandoori Chicken Half
            quantity: 1,
            unitPrice: 240,
            totalPrice: 240,
            status: 'READY',
          },
          {
            menuItemId: createdMenuItems[16].id, // Tender Coconut Falooda
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
      subtotal: 780,
      taxRate: 5.0,
      taxAmount: 39.0,
      discountType: 'FIXED',
      discountValue: 50,
      discountAmount: 50,
      grandTotal: 769.0,
      paymentStatus: 'PAID',
      payments: {
        create: {
          amount: 769.0,
          paymentMethod: 'UPI',
          transactionRef: 'UPI-REF-99281726',
          status: 'COMPLETED',
        },
      },
    },
  });
  console.log('✓ Sample Orders & Bills seeded');

  // 8. Authentic Gallery for Johnson Food Court (from Google Maps & Justdial)
  await prisma.gallery.deleteMany();
  const galleryItems = [
    {
      title: 'JFC Illuminated Neon Entrance Arch & Water Cascade',
      category: 'Ambience',
      imageUrl: '/images/gallery/jfc-entrance-neon.jpg',
      description: 'Iconic illuminated 3D red neon JFC entrance with stone waterfall feature along Arni Road, Pennathur.',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      title: 'Open-Air Scenic Garden Rooftop Terrace',
      category: 'Ambience',
      imageUrl: '/images/gallery/jfc-garden-terrace.jpg',
      description: 'Elevated open-air dining terrace with pagoda shade canopies, wicker furniture, and Vellore mountain views.',
      isFeatured: true,
      displayOrder: 2,
    },
    {
      title: 'Covered Garden Pavilion & Roadside Deck',
      category: 'Ambience',
      imageUrl: '/images/gallery/jfc-dining-pavilion.jpg',
      description: 'Modern sheltered dining deck with artificial green turf flooring, sleek steel columns, and panoramic street vistas.',
      isFeatured: true,
      displayOrder: 3,
    },
    {
      title: 'Crispy Honey Chilli Chicken Starter',
      category: 'Food',
      imageUrl: '/images/gallery/jfc-honey-chilli-chicken.jpg',
      description: 'Authentic wok-tossed crispy chicken coated in sweet & spicy glaze, sesame seeds, and scallions.',
      isFeatured: true,
      displayOrder: 4,
    },
    {
      title: 'Charcoal BBQ Mandi & Grilled Chicken Platter',
      category: 'Food',
      imageUrl: '/images/gallery/jfc-bbq-mandi-feast.jpg',
      description: 'Smoky charcoal-barbecued whole spiced chicken served on a bed of long-grain mandi rice with garlic toum.',
      isFeatured: true,
      displayOrder: 5,
    },
    {
      title: 'Wood-Fired Style Oven-Baked Pizza',
      category: 'Food',
      imageUrl: '/images/gallery/jfc-fresh-pizza.jpg',
      description: 'Hand-stretched artisan pizza loaded with mozzarella cheese, roasted chicken cubes, and aromatic herbs.',
      isFeatured: true,
      displayOrder: 6,
    },
    {
      title: 'Steamed Himalayan Chicken Dimsums & Momos',
      category: 'Food',
      imageUrl: '/images/gallery/jfc-steamed-momos.jpg',
      description: 'Freshly steamed chicken momos served hot on terrace dining tables with spicy red pepper schezwan dip.',
      isFeatured: true,
      displayOrder: 7,
    },
    {
      title: 'Official JFC Menu Card - BBQ, Tandoori & Sea Foods',
      category: 'Menu Cards',
      imageUrl: '/images/gallery/jfc-menu-bbq-grills.jpg',
      description: 'Original physical restaurant menu spread showcasing full BBQ grills, shawarmas, fish manchurian, and chilli prawns.',
      isFeatured: true,
      displayOrder: 8,
    },
    {
      title: 'Official JFC Menu Card - Chinese Wok & Starters',
      category: 'Menu Cards',
      imageUrl: '/images/gallery/jfc-menu-chinese-starters.jpg',
      description: 'Authentic restaurant menu card featuring soups, fried rice varieties, hakka noodles, and tandoori kebabs.',
      isFeatured: true,
      displayOrder: 9,
    },
    {
      title: 'Official JFC Menu Card - Juices, Faloodas & Desserts',
      category: 'Menu Cards',
      imageUrl: '/images/gallery/jfc-menu-juices-desserts.jpg',
      description: 'Authentic beverage menu card detailing fresh fruit juices, specialty faloodas, thick shakes, and ice cream sundaes.',
      isFeatured: true,
      displayOrder: 10,
    },
  ];

  for (const g of galleryItems) {
    await prisma.gallery.create({ data: g });
  }
  console.log('✓ Authentic JFC Gallery seeded (10 real photos)');

  // 9. Authentic Local Testimonials for JFC Vellore
  const testimonialsData = [
    {
      customerName: 'Suresh Kumar',
      customerRole: 'Pennathur Local & Regular Diner',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      rating: 5,
      content: 'Best open-air evening hangout spot in Pennathur Arni Road! The Rumali Shawarma and Honey Chilli Chicken are out of the world. Great family vibes.',
      isApproved: true,
    },
    {
      customerName: 'Priya Ranganathan',
      customerRole: 'CMC Hospital Staff / Vellore',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      rating: 5,
      content: 'We frequently visit JFC on weekends. Pocket-friendly pricing, generous portions, and the Chicken Fried Rice & BBQ chicken taste awesome under the open sky!',
      isApproved: true,
    },
    {
      customerName: 'Karthik Narayanan',
      customerRole: 'Family Diner on Arni Road',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      rating: 4,
      content: 'Superb ambiance and plenty of parking space. The Bun Parotta and Dum Biryani are top notch. Must visit when driving through Bagayam-Pennathur.',
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

  // 10. Contact Messages for JFC
  const messagesData = [
    {
      name: 'Venkatesh Prasad',
      email: 'venkat.p@gmail.com',
      phone: '+91 99652 11223',
      subject: 'Open-Air Lawn Birthday Party (30 Guests)',
      message: 'Hi JFC Team, planning my daughter birthday party this Saturday evening at the outdoor garden. Please share party combo packages.',
      status: 'UNREAD',
    },
  ];

  for (const m of messagesData) {
    const existing = await prisma.message.findFirst({ where: { email: m.email, subject: m.subject } });
    if (!existing) {
      await prisma.message.create({ data: m });
    }
  }
  console.log('✓ Contact Messages seeded');

  // 11. Restaurant Settings for Johnson Food Court (JFC)
  await prisma.setting.upsert({
    where: { id: 'default' },
    update: {
      restaurantName: 'Johnson Food Court (JFC)',
      tagLine: 'Multi-Cuisine Food Court & Open-Air Garden Dining',
      logo: '/images/jfc-logo.svg',
      address: 'Sherwood, Bagayam, Arni Road, Pennathur, Vellore, Tamil Nadu – 632011',
      phone: '+91 99652 78872',
      email: 'contact@johnsonfoodcourt.com',
      openingHours: 'Mon - Sat: 10:30 AM - 11:30 PM | Sun: 12:30 PM - 11:30 PM',
      currency: 'INR',
      currencySymbol: '₹',
      taxRate: 5.0,
      taxNumber: 'GSTIN33AAACJ1234F1Z5',
      websiteUrl: 'https://maps.app.goo.gl/VubJq18cKDMrij7w5',
      facebookUrl: 'https://www.justdial.com/Vellore/Jhonson-Food-Court-Jfc-Bagayam-Pennathur/9999PX416-X416-240319224157-K4W3_BZDET',
      instagramUrl: 'https://instagram.com/johnsonfoodcourt_jfc',
      twitterUrl: 'https://maps.app.goo.gl/VubJq18cKDMrij7w5',
    },
    create: {
      id: 'default',
      restaurantName: 'Johnson Food Court (JFC)',
      tagLine: 'Multi-Cuisine Food Court & Open-Air Garden Dining',
      logo: '/images/jfc-logo.svg',
      address: 'Sherwood, Bagayam, Arni Road, Pennathur, Vellore, Tamil Nadu – 632011',
      phone: '+91 99652 78872',
      email: 'contact@johnsonfoodcourt.com',
      openingHours: 'Mon - Sat: 10:30 AM - 11:30 PM | Sun: 12:30 PM - 11:30 PM',
      currency: 'INR',
      currencySymbol: '₹',
      taxRate: 5.0,
      taxNumber: 'GSTIN33AAACJ1234F1Z5',
      websiteUrl: 'https://maps.app.goo.gl/VubJq18cKDMrij7w5',
      facebookUrl: 'https://www.justdial.com/Vellore/Jhonson-Food-Court-Jfc-Bagayam-Pennathur/9999PX416-X416-240319224157-K4W3_BZDET',
      instagramUrl: 'https://instagram.com/johnsonfoodcourt_jfc',
      twitterUrl: 'https://maps.app.goo.gl/VubJq18cKDMrij7w5',
    },
  });
  console.log('✓ Settings seeded for Johnson Food Court (JFC)');

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
