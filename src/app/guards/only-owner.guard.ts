import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

@Injectable()
export class OnlyOwner implements CanActivate {
    constructor(private appService: AppService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { appId } = req.params;
        const userId = req.user.id;

        return this.validateAppOwner(userId, appId);
    }

    async validateAppOwner(userId: string, appId: string): Promise<boolean> {
        const app = await this.appService.getById(appId);

        if (!app) {
            throw new NotFoundException(`App [${appId}] Not found`);
        }

        return app.owner.toString() === userId;
    }
}
