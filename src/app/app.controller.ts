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
import { AppService } from './app.service';
import { CreateSecondaryAppDto } from './dtos/create-app';
import { EditAppDTO } from './dtos/edit-app';
import { InviteUserToAppDto } from './dtos/invite-user.dto';
import { OnlyOwner } from './guards';

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

    @Post(':appId/users')
    @UseGuards(JwtAuthGuard, OnlyOwner)
    async inviteUser(
        @Request() req,
        @Param('appId') appId: string,
        @Body(new ValidationPipe()) appDto: InviteUserToAppDto,
    ) {
        return this.appService.inviteUserToApp(appId, appDto, req.user.id);
    }

    @Patch(':appId')
    @UseGuards(JwtAuthGuard, OnlyOwner)
    async editApp(
        @Param('appId') appId: string,
        @Body(new ValidationPipe()) appDto: EditAppDTO,
    ) {
        return this.appService.edit(appId, appDto);
    }

    @Delete(':appId')
    @UseGuards(JwtAuthGuard, OnlyOwner)
    @HttpCode(204)
    async deleteApp(@Param('appId') appId: string) {
        this.appService.deleteAppById(appId);
    }
}
