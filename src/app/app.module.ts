import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from './schemas/app.schema';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: App.name, schema: AppSchema }]),
        forwardRef(() => UsersModule)
    ],
    providers: [AppService],
    exports: [AppService],
    controllers: [AppController],
})
export class AppModule {}
