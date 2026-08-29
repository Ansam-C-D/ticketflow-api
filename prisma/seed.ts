import {
  PrismaClient,
  Role,
  TicketPriority,
  TicketStatus
} from '@prisma/client';
import type { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type SeedUser = {
  email: string;
  name: string;
  password: string;
  role: Role;
};

const users: SeedUser[] = [
  {
    email: 'admin@example.com',
    name: 'Amina Admin',
    password: 'Admin123!',
    role: Role.ADMIN
  },
  {
    email: 'agent@example.com',
    name: 'Gabe Agent',
    password: 'Agent123!',
    role: Role.AGENT
  },
  {
    email: 'user1@example.com',
    name: 'Uma User',
    password: 'User123!',
    role: Role.USER
  },
  {
    email: 'user2@example.com',
    name: 'Nora User',
    password: 'User234!',
    role: Role.USER
  }
];

async function upsertUser(user: SeedUser) {
  const passwordHash = await bcrypt.hash(user.password, 10);

  return prisma.user.upsert({
    where: { email: user.email },
    update: {
      name: user.name,
      role: user.role,
      passwordHash
    },
    create: {
      email: user.email,
      name: user.name,
      role: user.role,
      passwordHash
    }
  });
}

async function main() {
  const seededUsers = await Promise.all(users.map(upsertUser));
  const byEmail = new Map(seededUsers.map((user) => [user.email, user]));

  const ticketInputs = [
    {
      title: 'Unable to reset password',
      description: 'Password reset emails are not arriving for some accounts.',
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
      createdById: byEmail.get('user1@example.com')!.id,
      assignedToId: byEmail.get('agent@example.com')!.id
    },
    {
      title: 'Payment failed during checkout',
      description:
        'Card payment is rejected after the final confirmation step.',
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.URGENT,
      createdById: byEmail.get('user2@example.com')!.id,
      assignedToId: byEmail.get('agent@example.com')!.id
    },
    {
      title: 'Dashboard loading slowly',
      description:
        'The analytics dashboard takes more than 20 seconds to render.',
      status: TicketStatus.RESOLVED,
      priority: TicketPriority.MEDIUM,
      createdById: byEmail.get('user1@example.com')!.id,
      assignedToId: byEmail.get('agent@example.com')!.id
    },
    {
      title: 'Email notifications not arriving',
      description: 'Order confirmation emails are delayed or missing entirely.',
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
      createdById: byEmail.get('user2@example.com')!.id,
      assignedToId: null
    },
    {
      title: 'Incorrect invoice total',
      description: 'Tax is being applied twice on renewal invoices.',
      status: TicketStatus.CLOSED,
      priority: TicketPriority.HIGH,
      createdById: byEmail.get('user1@example.com')!.id,
      assignedToId: byEmail.get('agent@example.com')!.id
    },
    {
      title: 'Cannot update profile',
      description:
        'Saving changes on the profile page returns a generic error.',
      status: TicketStatus.OPEN,
      priority: TicketPriority.MEDIUM,
      createdById: byEmail.get('user2@example.com')!.id,
      assignedToId: null
    },
    {
      title: 'Export report fails',
      description: 'CSV export for weekly reports stops with a timeout.',
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.HIGH,
      createdById: byEmail.get('user1@example.com')!.id,
      assignedToId: byEmail.get('agent@example.com')!.id
    },
    {
      title: 'Mobile layout broken',
      description: 'Ticket list overflows on small screens in mobile browsers.',
      status: TicketStatus.OPEN,
      priority: TicketPriority.LOW,
      createdById: byEmail.get('user2@example.com')!.id,
      assignedToId: null
    },
    {
      title: 'Search results are inconsistent',
      description:
        'Searching for customer email addresses returns incomplete data.',
      status: TicketStatus.RESOLVED,
      priority: TicketPriority.MEDIUM,
      createdById: byEmail.get('user1@example.com')!.id,
      assignedToId: byEmail.get('agent@example.com')!.id
    },
    {
      title: 'Webhook delivery retries stuck',
      description: 'Failed webhook deliveries never leave the retry queue.',
      status: TicketStatus.OPEN,
      priority: TicketPriority.URGENT,
      createdById: byEmail.get('admin@example.com')!.id,
      assignedToId: byEmail.get('agent@example.com')!.id
    }
  ];

  for (const ticket of ticketInputs) {
    await prisma.ticket.upsert({
      where: {
        id: `${ticket.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`
      },
      update: ticket,
      create: {
        id: `${ticket.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`,
        ...ticket
      }
    });
  }

  const tickets = await prisma.ticket.findMany();

  const commentInputs: Prisma.CommentUncheckedCreateInput[] = [
    {
      ticketId: tickets[0]?.id as string,
      body: 'Your issues is now solved',
      authorId: tickets[0]?.createdById as string
    },
    {
      ticketId: tickets[1]?.id as string,
      body: 'Need more info for us to work on',
      authorId: tickets[1]?.createdById as string
    },
    {
      ticketId: tickets[2]?.id as string,
      body: 'Please send the photo of the machine',
      authorId: tickets[2]?.createdById as string
    }
  ];
  await prisma.comment.deleteMany();

  await prisma.comment.createMany({
    data: commentInputs
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error('Seed failed', error);
    await prisma.$disconnect();
    process.exit(1);
  });
