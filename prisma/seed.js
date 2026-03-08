const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.app.deleteMany({});

  await prisma.app.create({
    data: {
      name: 'Data Analyzer',
      description: 'Analyze your company data with ease.',
      category: 'Data',
      icon: '📊',
      color: 'from-green-500 to-emerald-600',
      localPath: 'apps/data-analyzer',
      dockerImage: 'c0mpile/data-analyzer',
      internalPort: 80,
    },
  });

  await prisma.app.create({
    data: {
      name: 'Demo Utility',
      description: 'A collection of useful helper tools.',
      category: 'Utility',
      icon: '🛠️',
      color: 'from-blue-500 to-indigo-600',
      localPath: 'apps/demo-utility',
      dockerImage: 'c0mpile/demo-utility',
      internalPort: 80,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
