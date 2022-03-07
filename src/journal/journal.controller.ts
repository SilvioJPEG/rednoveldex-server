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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { JournalService } from './journal.service';
import { updateJournalDto } from './update-journal.dto';
@Controller('journal')
export class JournalController {
  constructor(
    private journalService: JournalService,
    private usersService: UsersService,
  ) {}

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  async getByUsername(@Param('username') username: string) {
    const user = await this.usersService.getUserByName(username);
    return this.journalService.getByOwnerId(user.id);
  }

  @Patch('/update')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtAuthGuard)
  async update(@Req() req, @Body() updateJournalDto: updateJournalDto) {
    const user = req.user;
    return this.journalService.update(user.sub, updateJournalDto.novel_id);
  }

  @Post('/check')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async checkIfInJournal(@Req() req, @Body() body: { novel_id: number }) {
    const user = req.user;
    return this.journalService.checkIfInJournal(user.sub, body.novel_id);
  }
}
