import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Prisma create query to seed models in database
  await prisma.category.createMany({
    data: [{ name: "electronic" }, { name: "furniture" }, { name: "clothes" }],
  });
  const res = [
    "Mobile",
    "Earphone",
    "Meter",
    "TV",
    "Router",
    "Laptop",
    "Bulb",
    "Speaker",
    "Modem",
  ].map(
    async name =>
      await prisma.product.create({
        data: { name, category: { connect: { name: "electronic" } } },
      })
  );
  const res2 = [
    "Mobile",
    "Earphone",
    "Meter",
    "TV",
    "Router",
    "Laptop",
    "Bulb",
    "Speaker",
    "Modem",
  ].map(
    async name =>
      await prisma.product.create({
        data: { name, category: { connect: { name: "furniture" } } },
      })
  );
  const res3 = [
    "Mobile",
    "Earphone",
    "Meter",
    "TV",
    "Router",
    "Laptop",
    "Bulb",
    "Speaker",
    "Modem",
  ].map(
    async name =>
      await prisma.product.create({
        data: { name, category: { connect: { name: "clothes" } } },
      })
  );
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
