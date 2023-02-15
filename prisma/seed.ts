import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const kettlebell = await prisma.exercise.create({
    data: {
      title: "Kettlebell swings",
      description: "Basic kettlebell swings",
      mediaURL:
        "https://www.shutterstock.com/image-vector/man-doing-two-arm-kettlebell-600w-2212616761.jpg",
      mediaIsImage: true,
    },
  });

  const lunges = await prisma.exercise.create({
    data: {
      title: "Barbell lunges",
      description: "Basic barbell lunges",
      mediaURL:
        "https://www.shutterstock.com/image-vector/man-doing-lunges-barbell-exercise-600w-1831069621.jpg",
      mediaIsImage: true,
    },
  });

  const snatch = await prisma.exercise.create({
    data: {
      title: "Barbell snatch",
      description: "Basic barbell snatch",
      mediaURL:
        "https://www.shutterstock.com/image-vector/man-doing-barbell-snatch-step-600w-1840372210.jpg",
      mediaIsImage: true,
    },
  });
  console.log({ kettlebell, lunges, snatch });
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
