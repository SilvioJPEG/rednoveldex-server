import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddNovelDto } from './add-novel.dto';
import { NovelsService } from './novels.service';

@ApiTags('NOVELS')
@Controller('novels')
export class NovelsController {
  constructor(private novelsService: NovelsService) {}

  @Post()
  create(@Body() userDto: AddNovelDto) {
    return this.novelsService.create(userDto);
  }

  @Get(':path')
  findByUrlPath(@Param('path') path: string) {
    return this.novelsService.findByUrlPath(path);
  }
}
