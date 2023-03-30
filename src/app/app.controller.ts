import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Request,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { AppService } from './app.service';
import { EditAppDTO } from './dtos/edit-app';
import { OnlyOwner } from './guards';

@Controller('app')
export class AppController {
    constructor(private appService: AppService) {}

    @Get("")
    @UseGuards(JwtAuthGuard)
    async getUsersApps(@Request() req) {
        return this.appService.findAllUserApps(req.user.id);
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
