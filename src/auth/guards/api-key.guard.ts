import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SecurityConstants } from '../constants';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const key = req.headers['api-key'] ?? req.query.api_key; // checks the header, moves to query if null
        return key === SecurityConstants.apiKey;
    }
}
