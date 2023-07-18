import { Module } from '@nestjs/common';
import { PortalsService } from './portals.service';
import { PortalsController } from './portals.controller';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [HttpModule, UsersModule],
  controllers: [PortalsController],
  providers: [PortalsService],
})
export class PortalsModule {}
