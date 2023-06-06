import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true, logger: ["log", "error", "warn"] });
    app.useGlobalInterceptors(
        new SanitizeMongooseModelInterceptor({
            excludeMongooseId: false,
            excludeMongooseV: true,
        }),
    );
    await app.listen(3000);
}
bootstrap();
