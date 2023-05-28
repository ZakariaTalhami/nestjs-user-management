export class JwtConstants {
  public static get accessTokenSecret(): string {
    return process.env.ACCESS_TOKEN_SECRET;
  }

  public static get accessTokenExpire(): string {
    return process.env.ACCESS_TOKEN_EXPIRE;
  }

  public static get refreshTokenSecret(): string {
    return process.env.REFRESH_TOKEN_SECRET;
  }

  public static get refreshTokenExpire(): string {
    return process.env.REFRESH_TOKEN_EXPIRE;
  }

  public static get ResetPasswordTokenSecret(): string {
    return process.env.RESET_PASSWORD_TOKEN_SECRET;
  }

  public static get ResetPasswordTokenExpire(): string {
    return process.env.RESET_PASSWORD_EXPIRE;
  }
}

export class ResetPasswordConstants {
  public static get ResetPasswordBaseUrl(): string {
    return process.env.RESET_PASSWORD_BASE_URL;
  }
  
  public static get ResetPasswordEmailTemplate(): string {
    return process.env.RESET_PASSWORD_EMAIL_TEMPLATE;
  }
}

export class SecurityConstants {
  public static get apiKey(): string {
    return process.env.API_KEY;
  }
}
