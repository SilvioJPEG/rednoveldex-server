import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { AddNovelDto } from './add-novel.dto';
import { NovelsService } from './novels.service';

@Controller('novels')
export class NovelsController {
  constructor(private novelsService: NovelsService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.novelsService.getOne(id);
  }
  @Post()
  create(@Body() userDto: AddNovelDto) {
    return this.novelsService.create(userDto);
  }
}
