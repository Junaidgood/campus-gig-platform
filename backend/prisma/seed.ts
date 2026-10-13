import { PrismaClient, Role, GigStatus, OrderStatus, TransactionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Database with Real Dynamic Campus Data ---');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create or Update Users
  const clientUser = await prisma.user.upsert({
    where: { email: 'junaid@ucp.edu.pk' },
    update: {},
    create: {
      email: 'junaid@ucp.edu.pk',
      fullName: 'Muhammad Junaid',
      password: hashedPassword,
      role: Role.CLIENT,
      department: 'Computer Science',
      semester: 6,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'CS Student looking for experienced peers to collaborate on semester projects.',
    },
  });

  const taskerHamza = await prisma.user.upsert({
    where: { email: 'hamza.malik@ucp.edu.pk' },
    update: {},
    create: {
      email: 'hamza.malik@ucp.edu.pk',
      fullName: 'Hamza Malik',
      password: hashedPassword,
      role: Role.TASKER,
      department: 'Computer Science',
      semester: 7,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Full-Stack MERN & Next.js Developer with 2+ years of freelancing experience.',
      skills: ['React', 'Next.js', 'Node.js', 'MongoDB', 'PostgreSQL', 'TypeScript'],
    },
  });

  const taskerAyesha = await prisma.user.upsert({
    where: { email: 'ayesha.khan@ucp.edu.pk' },
    update: {},
    create: {
      email: 'ayesha.khan@ucp.edu.pk',
      fullName: 'Ayesha Khan',
      password: hashedPassword,
      role: Role.TASKER,
      department: 'Software Engineering',
      semester: 6,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Certified Figma UI/UX Designer. Passionate about creating sleek, human-centered interfaces.',
      skills: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'Design Systems'],
    },
  });

  const taskerBilal = await prisma.user.upsert({
    where: { email: 'bilal.tariq@ucp.edu.pk' },
    update: {},
    create: {
      email: 'bilal.tariq@ucp.edu.pk',
      fullName: 'Bilal Tariq',
      password: hashedPassword,
      role: Role.TASKER,
      department: 'Data Science',
      semester: 8,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Data Science enthusiast. Expert in Python, Pandas, Scikit-learn, and Deep Learning.',
      skills: ['Python', 'Pandas', 'Machine Learning', 'Data Visualization', 'SQL'],
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ucp.edu.pk' },
    update: {},
    create: {
      email: 'admin@ucp.edu.pk',
      fullName: 'Campus Admin',
      password: hashedPassword,
      role: Role.ADMIN,
      department: 'University Administration',
    },
  });

  // 2. Wallets
  await prisma.wallet.upsert({
    where: { userId: clientUser.id },
    update: { balance: 12500 },
    create: {
      userId: clientUser.id,
      balance: 12500,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: taskerHamza.id },
    update: { balance: 8100 },
    create: {
      userId: taskerHamza.id,
      balance: 8100,
    },
  });

  // 3. Create Approved Gigs
  const gig1 = await prisma.gig.create({
    data: {
      title: 'Full-Stack MERN & Next.js Web Application Development',
      description: 'Clean modular code with REST APIs, authentication, MongoDB/PostgreSQL database, and responsive modern UI.',
      price: 4500,
      deliveryTime: 3,
      status: GigStatus.APPROVED,
      taskerId: taskerHamza.id,
    },
  });

  const gig2 = await prisma.gig.create({
    data: {
      title: 'UI/UX Design in Figma: Mobile App & Web Dashboard',
      description: 'Interactive high-fidelity prototypes, design system with reusable components, wireframes, and developer handoff.',
      price: 3200,
      deliveryTime: 2,
      status: GigStatus.APPROVED,
      taskerId: taskerAyesha.id,
    },
  });

  const gig3 = await prisma.gig.create({
    data: {
      title: 'Python Machine Learning, Data Analysis & Pandas Scripting',
      description: 'Jupyter notebooks, data cleaning, exploratory analysis, classification/regression models, and Matplotlib visuals.',
      price: 4000,
      deliveryTime: 2,
      status: GigStatus.APPROVED,
      taskerId: taskerBilal.id,
    },
  });

  const gig4 = await prisma.gig.create({
    data: {
      title: 'C++ & Data Structures (DSA) Assignment Consultation & Tutoring',
      description: 'Trees, Graphs, Pointers, Linked Lists, Big-O algorithm analysis with step-by-step logic explanation.',
      price: 2500,
      deliveryTime: 1,
      status: GigStatus.APPROVED,
      taskerId: taskerHamza.id,
    },
  });

  // 4. Create Sample Real Order & Review
  const orderCompleted = await prisma.order.create({
    data: {
      gigId: gig1.id,
      clientId: clientUser.id,
      taskerId: taskerHamza.id,
      price: 4500,
      requirements: 'Need student dashboard with clean responsive design and backend APIs.',
      deliveryNote: 'Completed! GitHub Repository: https://github.com/ucp-student/campus-gig-final. Live demo deployed on Vercel.',
      status: OrderStatus.COMPLETED,
    },
  });

  await prisma.review.create({
    data: {
      orderId: orderCompleted.id,
      gigId: gig1.id,
      clientId: clientUser.id,
      taskerId: taskerHamza.id,
      rating: 5,
      comment: 'Exceptional quality! Delivered clean TypeScript and Next.js code ahead of time.',
    },
  });

  const orderInProgress = await prisma.order.create({
    data: {
      gigId: gig2.id,
      clientId: clientUser.id,
      taskerId: taskerAyesha.id,
      price: 3200,
      requirements: 'E-commerce mobile app wireframes & prototypes with 15+ screens.',
      status: OrderStatus.IN_PROGRESS,
    },
  });

  // 5. Seed Transactions for Client
  const clientWalletRecord = await prisma.wallet.findUnique({ where: { userId: clientUser.id } });
  if (clientWalletRecord) {
    const existingTxCount = await prisma.transaction.count({ where: { walletId: clientWalletRecord.id } });
    if (existingTxCount === 0) {
      await prisma.transaction.createMany({
        data: [
          {
            walletId: clientWalletRecord.id,
            amount: 15000,
            type: TransactionType.DEPOSIT,
            description: 'JazzCash Instant Top-up',
          },
          {
            walletId: clientWalletRecord.id,
            amount: -2500,
            type: TransactionType.ESCROW_LOCK,
            description: 'Escrow lock for C++ DSA Assignment',
          },
        ],
      });
    }
  }

  // 6. Seed Real Conversations & Messages
  const [u1, u2] = [clientUser.id, taskerHamza.id].sort();
  const convHamza = await prisma.conversation.upsert({
    where: {
      user1Id_user2Id: {
        user1Id: u1,
        user2Id: u2,
      },
    },
    update: {},
    create: {
      user1Id: u1,
      user2Id: u2,
      gigId: gig1.id,
      orderId: orderCompleted.id,
      lastMessageAt: new Date(),
    },
  });

  const msgCountHamza = await prisma.message.count({ where: { conversationId: convHamza.id } });
  if (msgCountHamza === 0) {
    await prisma.message.createMany({
      data: [
        {
          conversationId: convHamza.id,
          senderId: taskerHamza.id,
          text: 'Salam Junaid! Thanks for reaching out. What are the specific requirements for your Next.js project?',
        },
        {
          conversationId: convHamza.id,
          senderId: clientUser.id,
          text: 'Waleikum Assalam! We need clean NestJS backend integration with PostgreSQL and responsive UI.',
        },
        {
          conversationId: convHamza.id,
          senderId: taskerHamza.id,
          text: 'Got it! Starting work on it today. Will keep you posted with demo links.',
        },
      ],
    });
  }

  const [uA, uB] = [clientUser.id, taskerAyesha.id].sort();
  const convAyesha = await prisma.conversation.upsert({
    where: {
      user1Id_user2Id: {
        user1Id: uA,
        user2Id: uB,
      },
    },
    update: {},
    create: {
      user1Id: uA,
      user2Id: uB,
      gigId: gig2.id,
      orderId: orderInProgress.id,
      lastMessageAt: new Date(),
    },
  });

  const msgCountAyesha = await prisma.message.count({ where: { conversationId: convAyesha.id } });
  if (msgCountAyesha === 0) {
    await prisma.message.createMany({
      data: [
        {
          conversationId: convAyesha.id,
          senderId: taskerAyesha.id,
          text: 'Hi Junaid! I reviewed your design brief for the mobile app prototype.',
        },
        {
          conversationId: convAyesha.id,
          senderId: clientUser.id,
          text: 'Awesome! Looking forward to seeing the initial Figma wireframes.',
        },
      ],
    });
  }

  console.log('--- Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
