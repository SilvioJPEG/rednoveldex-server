import { Controller } from '@nestjs/common';

@Controller('posts')
export class PostsController {
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
