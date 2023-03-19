import { createHash } from 'crypto';

export class HashUtils {
  static hashToken = (token: string) => {
    return createHash("sha512").update(token).digest("hex");
  };
}
