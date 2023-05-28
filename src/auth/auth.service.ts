import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare as comparePassword } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtConstants, ResetPasswordConstants } from './constants';
import { TokenService } from './token.service';
import {
    ForgotPasswordDto,
    ResetPasswordDto,
} from './dtos/forgot-password.dto';
import { UserTokenType } from './enums';
import { EmailService } from 'src/common/email.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tokenService: TokenService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email);

        const isUserPasswordVerified = await comparePassword(
            password,
            user?.password,
        );
        if (isUserPasswordVerified) {
            return user;
        }

        return null;
    }

    async login(user: any) {
        const payload = { sub: user.id };
        return this.generateTokens(payload);
    }

    async refreshTokens(user: any) {
        const userRecord = await this.usersService.findUserById(user.id);

        if (!userRecord) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id };
        return this.generateTokens(payload);
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const userRecord = await this.usersService.findUserByEmail(
            forgotPasswordDto.email,
        );

        if (userRecord) {
            const resetPasswordToken = await this.tokenService.generateToken(
                userRecord.id,
                { sub: userRecord.id },
                UserTokenType.RESET_PASSWORD,
            );

            this.emailService.sendEmailTemplate(
                ResetPasswordConstants.ResetPasswordEmailTemplate,
                userRecord.email,
                {
                    resetUrl: `${ResetPasswordConstants.ResetPasswordBaseUrl}?resetToken=${resetPasswordToken}`,
                },
            );
        }
    }

    async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
        await this.usersService.resetPasswordById(userId, resetPasswordDto.password);
    }

    private generateTokens(payload: any) {
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, {
                secret: JwtConstants.refreshTokenSecret,
                expiresIn: JwtConstants.refreshTokenExpire,
            }),
        };
    }
}
