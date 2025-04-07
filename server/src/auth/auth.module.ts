import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, PrismaClient, JwtService],
  controllers: [AuthController]
})
export class AuthModule {}
