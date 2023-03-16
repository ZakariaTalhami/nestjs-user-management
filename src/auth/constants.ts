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
}
