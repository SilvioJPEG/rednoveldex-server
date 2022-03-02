import { Body, Controller, Post } from '@nestjs/common';
import { AddPostDto } from './add-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  create(@Body() postDto: AddPostDto) {

  }


}
