import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddNovelDto } from './add-novel.dto';
import { Novel } from './novels.model';
import { userFavourites } from './user-favourites.model';

@Injectable()
export class NovelsService {
  constructor(
    @InjectModel(Novel) private novelRepository: typeof Novel,
    @InjectModel(userFavourites) private UFRep: typeof userFavourites,
  ) {}

  async getOne(id: number) {
    const novel = await this.novelRepository.findByPk(id);
    return novel;
  }

  async create(dto: AddNovelDto) {
    const novel = await this.novelRepository.create(dto);
    return novel;
  }

  async getRecentlyAdded(amount: number) {
    const novels = await this.novelRepository.findAll();
    novels.sort((a, b) => {
      if (a.createdAt < b.createdAt) return -1;
      if ((a.createdAt = b.createdAt)) return -1;
      if (a.createdAt > b.createdAt) return 1;
    });
    if (amount >= novels.length) {
      return novels;
    }
    return novels.slice(0, amount);
  }
}
