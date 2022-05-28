import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  Body,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { JournalService } from './journal.service';
import { updateEntityDto } from './update-journal.dto';
@Controller('journal')
export class JournalController {
  constructor(
    private journalService: JournalService,
    private usersService: UsersService,
  ) {}

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  async getByUsername(@Param('username') username: string) {
    const user = await this.usersService.getUserFull(username);
    return this.journalService.getJournalByOwnerId(user.id);
  }

  @Post('/check')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async checkIfInJournal(@Req() req, @Body() body: { novel_id: number }) {
    const user_id = req.user.sub;
    return this.journalService.checkIfInJournal(user_id, body.novel_id);
  }

  @Post('/count')
  @HttpCode(HttpStatus.OK)
  async countJournalEntities(@Body() body: { username: string }) {
    const user = await this.usersService.getUserProfile(body.username);
    return this.journalService.getJournalLength(user.id);
  }

  // JournalEntity roots

  @Post('/entity/:novel_id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async update(@Req() req, @Param('novel_id') novel_id: number) {
    const user_id = req.user.sub;
    return this.journalService.addEntity(user_id, novel_id);
  }

  @Delete('/entity/:novel_id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async delete(@Req() req, @Param('novel_id') novel_id: number) {
    const user_id = req.user.sub;
    return this.journalService.deleteEntity(user_id, novel_id);
  }

  @Patch('/entity/:novel_id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtAuthGuard)
  async updateEntity(
    @Req() req,
    @Param('novel_id') novel_id: number,
    @Body() updateJournalDto: updateEntityDto,
  ) {
    return this.journalService.updateEntry(
      req.user.sub,
      novel_id,
      updateJournalDto,
    );
  }
}
