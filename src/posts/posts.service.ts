import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {Post} from "../posts/posts.model"
@Injectable()
export class PostsService {
    constructor(@InjectModel(Post) private postRepository: typeof Post) {}
    async getAllByUser() {
        const posts = await this.postRepository.findAll();
        return posts;
    }
}
