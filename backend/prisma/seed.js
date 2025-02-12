import { PrismaClient, InvestorMentorType } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const categories = ['Ai', 'Blockchain', 'Ev', 'Ecommerce', 'Video'];

async function main() {
  console.log('Generating fake investors and mentors...');

  // Generate Fake Investors & Mentors
  const investorsAndMentors = [];
  for (let i = 0; i < 50; i++) {
    const profile = {
      name: faker.person.firstName(),
      category: categories[Math.floor(Math.random() * categories.length)], // Random category selection
      type: i % 2 === 0 ? InvestorMentorType.Investor : InvestorMentorType.Mentor,
    };
    investorsAndMentors.push(profile);
  }

  // Print generated data
  console.table(investorsAndMentors);

  // Wait for user input before inserting
  console.log('\nPress Enter to insert into the database...');
  process.stdin.once('data', async () => {
    const createdProfiles = await prisma.investorMentor.createMany({
      data: investorsAndMentors,
    });

    console.log(`✅ Inserted ${createdProfiles.count} investor/mentor profiles.`);
    process.exit(0);
  });
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
