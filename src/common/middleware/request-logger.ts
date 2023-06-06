import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger(LoggerMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(req.path);
        this.logger.log(req.params);
        this.logger.log(req.body);
        this.logger.log(req.headers);
        next();
    }
}
