import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { CommonModule } from 'src/common/common.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CommonModule, JwtModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [],
})
export class WorkspaceModule {}
