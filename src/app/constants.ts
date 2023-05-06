export class InvitationConstants {
    public static get invitationEmailTemplate() : string {
        return process.env.INVITATION_EMAIL_TEMPLATE;
    }
    
    public static get invitationEmailRedirectUrl() : string {
        return process.env.INVITATION_BASE_URL;
    }

    public static get invitationTokenSecret(): string {
        return process.env.INVITATION_TOKEN_SECRET;
    }

    public static get invitationExpire(): string {
        return process.env.INVITATION_EXPIRE;
    }
}