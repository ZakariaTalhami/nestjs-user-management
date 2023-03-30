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
import { JwtAuthGuard } from 'src/auth/guards';
import { AppService } from './app.service';
import { CreateSecondaryAppDto } from './dtos/create-app';
import { EditAppDTO } from './dtos/edit-app';
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
        createAppDto.owner = req.user.id;
        return this.appService.create(createAppDto);
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
