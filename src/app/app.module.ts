import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from './schemas/app.schema';
import { AppService } from './app.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: App.name, schema: AppSchema }]),
    ],
    providers: [AppService],
})
export class AppModule {}
