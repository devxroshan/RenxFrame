import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthCreateDto } from './dto/auth-create.dto';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async createUser(userDto: AuthCreateDto) {
    return this.prismaService.user.create({
      data: userDto,
    });
  }
}
