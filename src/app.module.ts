import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBaseConfig } from './config/database.config.service';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DataBaseConfig,
      inject: [DataBaseConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
