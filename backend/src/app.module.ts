import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { GigsModule } from './gigs/gigs.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { WalletModule } from './wallet/wallet.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { ChatModule } from './chat/chat.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { ProfileModule } from './profile/profile.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    GigsModule,
    OrdersModule,
    WalletModule,
    ReviewsModule,
    ChatModule,
    NotificationsModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
