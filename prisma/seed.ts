import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Food' },
      update: {},
      create: { name: 'Food' }
    }),
    prisma.category.upsert({
      where: { name: 'Drinks' },
      update: {},
      create: { name: 'Drinks' }
    }),
    prisma.category.upsert({
      where: { name: 'Desserts' },
      update: {},
      create: { name: 'Desserts' }
    }),
    prisma.category.upsert({
      where: { name: 'Snacks' },
      update: {},
      create: { name: 'Snacks' }
    })
  ]);

  console.log('✅ Categories created:', categories.map(c => c.name));

  // Create sample products
  const foodCategory = categories.find(c => c.name === 'Food');
  const drinksCategory = categories.find(c => c.name === 'Drinks');
  const dessertsCategory = categories.find(c => c.name === 'Desserts');

  if (foodCategory) {
    await prisma.product.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Chicken Burger',
        description: 'Delicious chicken burger with fresh vegetables',
        price: 12.99,
        categoryId: foodCategory.id,
        isAvailable: true
      }
    });

    await prisma.product.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Beef Pizza',
        description: 'Classic beef pizza with mozzarella cheese',
        price: 18.50,
        categoryId: foodCategory.id,
        isAvailable: true
      }
    });
  }

  if (drinksCategory) {
    await prisma.product.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Fresh Orange Juice',
        description: '100% fresh squeezed orange juice',
        price: 4.99,
        categoryId: drinksCategory.id,
        isAvailable: true
      }
    });
  }

  if (dessertsCategory) {
    await prisma.product.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with cream',
        price: 8.99,
        categoryId: dessertsCategory.id,
        isAvailable: true
      }
    });
  }

  console.log('✅ Sample products created');

  // Create admin user
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@foodapp.com' },
    update: {},
    create: {
      email: 'admin@foodapp.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin user created (email: admin@foodapp.com, password: admin123)');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
