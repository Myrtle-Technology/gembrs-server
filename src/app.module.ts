import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { OrganizationModule } from './organization/organization.module';
import { RoleModule } from './role/role.module';
import { ResourceModule } from './resource/resource.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/gembrs'),
    UserModule,
    MemberModule,
    OrganizationModule,
    RoleModule,
    ResourceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
