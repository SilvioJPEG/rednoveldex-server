import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddNovelDto } from './add-novel.dto';
import { Novel } from './novels.model';

@Injectable()
export class NovelsService {
  constructor(@InjectModel(Novel) private novelRepository: typeof Novel) {}

  async getOne(id: number) {
    const novel = await this.novelRepository.findOne({ where: { id } });
    return novel;
  }
  async create(NovelDto: AddNovelDto) {
      
  }
  async findByUrlPath(path:string) {
    const novel = await this.novelRepository.findOne({ where: { urlPath: path } });
    return novel;
  }
}
