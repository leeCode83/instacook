import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [RecipesService, PrismaClient],
  controllers: [RecipesController]
})
export class RecipesModule {}
