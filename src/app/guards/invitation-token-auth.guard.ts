import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InviteService } from '../invite.service';

@Injectable()
export class InvitationTokenAuth implements CanActivate {
    constructor(private inviteService: InviteService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const inviteToken = req.headers['invite-token'];
        const invitation =
            this.inviteService.decodeInvitationService(inviteToken);

        req.invite = invitation;

        return true;
    }
}
