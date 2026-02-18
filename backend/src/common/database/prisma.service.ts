import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { connect } from 'http2';

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
      Logger.log('Database connection established successfully');
    }).catch((error) => {
      Logger.error('Failed to connect to the database', error);
    });
  }
}
