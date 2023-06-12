import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Request,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards';
import { RequirePermissions } from 'src/rbac/decorators';
import { Authorize } from 'src/rbac/guards';
import { Permissions } from 'src/rbac/permission/enums';
import { AppService } from './app.service';
import { CreateSecondaryAppDto } from './dtos/create-app';
import { EditAppDTO } from './dtos/edit-app';
import { EditAppUserDto } from './dtos/edit-app-user.dto';
import { InviteUserToAppDto } from './dtos/invite-user.dto';
import { InvitationTokenAuth } from './guards/invitation-token-auth.guard';

@Controller('app')
export class AppController {
    constructor(private appService: AppService) {}

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getUsersApps(@Request() req) {
        return this.appService.findAllUserApps(req.user.id);
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    async createNewApp(
        @Request() req,
        @Body(new ValidationPipe()) createAppDto: CreateSecondaryAppDto,
    ) {
        createAppDto.owner = new Types.ObjectId(req.user.id);
        return this.appService.create(createAppDto);
    }

    @Get(':appId/users')
    @RequirePermissions(Permissions.USER_READ)
    @UseGuards(JwtAuthGuard, Authorize)
    async listAppUsers(
        @Param('appId') appId: string
    ) {
        return this.appService.listAppUsers(appId);
    }


    @Post(':appId/users')
    @RequirePermissions(Permissions.USER_INVITE)
    @UseGuards(JwtAuthGuard, Authorize)
    async inviteUser(
        @Request() req,
        @Param('appId') appId: string,
        @Body(new ValidationPipe()) appDto: InviteUserToAppDto,
    ) {
        return this.appService.inviteUserToApp(appId, appDto, req.user.id);
    }

    @Patch(':appId/users/:userId')
    @RequirePermissions(Permissions.USER_EDIT)
    @UseGuards(JwtAuthGuard, Authorize)
    async editAppUser(
        @Request() req,
        @Param('appId') appId: string,
        @Param('userId') userId: string,
        @Body(new ValidationPipe()) appUserDto: EditAppUserDto,
    ) {
        return this.appService.editAppUser(
            appId,
            userId,
            appUserDto,
            req.user.id,
        );
    }

    @Delete(':appId/users/:userId')
    @RequirePermissions(Permissions.USER_DELETE)
    @UseGuards(JwtAuthGuard, Authorize)
    async deleteAppUser(
        @Request() req,
        @Param('appId') appId: string,
        @Param('userId') userId: string,
    ) {
        return this.appService.deleteAppUser(appId, userId, req.user.id);
    }

    @Post('invite/accept')
    @UseGuards(JwtAuthGuard, InvitationTokenAuth)
    async acceptUserInvitation(@Request() req) {
        return this.appService.acceptUserInvitation(req.user.id, req.invite.id);
    }

    @Patch(':appId')
    @RequirePermissions(Permissions.APP_EDIT)
    @UseGuards(JwtAuthGuard, Authorize)
    async editApp(
        @Param('appId') appId: string,
        @Body(new ValidationPipe()) appDto: EditAppDTO,
    ) {
        return this.appService.edit(appId, appDto);
    }

    @Delete(':appId')
    @RequirePermissions(Permissions.APP_DELETE)
    @UseGuards(JwtAuthGuard, Authorize)
    @HttpCode(204)
    async deleteApp(@Param('appId') appId: string) {
        this.appService.deleteAppById(appId);
    }

    @Get(':appId/permissions')
    @UseGuards(JwtAuthGuard)
    async getAppUserPermissions(@Request() req, @Param('appId') appId: string) {
        return this.appService.listUserPermissionsInApp(appId, req.user.id);
    }

    @Post(':appId/current')
    @UseGuards(JwtAuthGuard)
    async setCurrentUserApp(@Request() req, @Param('appId') appId: string) {
        return this.appService.setCurrentUserApp(
            new Types.ObjectId(appId),
            new Types.ObjectId(req.user.id),
        );
    }
}
