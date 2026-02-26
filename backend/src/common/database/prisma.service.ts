import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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
      Logger.log('PostgreSQL connection established successfully');
    }).catch((error) => {
      Logger.error('Failed to connect to the PostgreSQL database:', error);
    });
  }
}
