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
    const user = await this.usersService.getUserProfile(username);
    console.log(user);
    return this.journalService.getJournalByOwnerId(user.id);
  }

  @Patch('/update')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtAuthGuard)
  async update(@Req() req, @Body() updateJournalDto: updateJournalDto) {
    const user_id = req.user.sub;
    return this.journalService.update(user_id, updateJournalDto.novel_id);
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
}
