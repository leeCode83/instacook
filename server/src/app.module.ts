import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), RecipesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
