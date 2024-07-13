import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.popularLocations.upsert({
    where: {
      id: "paris",
    },
    create: {
      id: "paris",
      name: "Paris",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=chris-karidis-nnzkZNYWHaU-unsplash.jpg&w=640",
      imageAttributes: "https://unsplash.com/@chriskaridis",
    },
    update: {},
  });

  await prisma.popularLocations.upsert({
    where: {
      id: "rome",
    },
    create: {
      id: "rome",
      name: "Rome",
      image:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=david-kohler-VFRTXGw1VjU-unsplash.jpg&w=640",
      imageAttributes: "https://unsplash.com/@davidkhlr",
    },
    update: {},
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
