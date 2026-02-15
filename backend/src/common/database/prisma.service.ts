import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({adapter});
  }

  onModuleInit() {
    this.$connect().then(() => {
      console.log('Connected to the database');
    }).catch((error) => {
      console.error('Failed to connect to the database', error);
    });
  }
}
