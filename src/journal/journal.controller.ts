import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { JournalService } from './journal.service';

@Controller('journal')
export class JournalController {
  constructor(private journalService: JournalService, private usersService: UsersService) {}

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    const user = await this.usersService.getUserByName(username);
    return this.journalService.getByOwnerId(user.id);
  }

  @Patch(':username')
  @UseGuards(JwtAuthGuard)
  update(journalUpdateDto: any) {
    return this.journalService.update(journalUpdateDto);
  }
}
