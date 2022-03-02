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
    const novel = await this.novelRepository.findOne({ where: { id } });
    return novel;
  }

  async create(dto: AddNovelDto) {
    const user = await this.novelRepository.create(dto);
    return user;
  }

  async AddToFavourites(novel_id: number, user_id: number) {
    const favourited = await this.UFRep.create({ user_id, novel_id });
    return favourited;
  }

  async DeleteFromFavourites(novel_id: number, user_id: number) {
    const unfavourited = await this.UFRep.destroy({
      where: { user_id, novel_id },
    });
    return unfavourited;
  }

  async GetFavouritesByUser(user_id: number) {
    let favourites: Novel[] = [];
    this.UFRep.findAll({ where: { user_id } }).then(
      (userFavs: userFavourites[]) => {
        userFavs.forEach(async (userFav: userFavourites) => {
          let favNovel = await this.novelRepository.findByPk(userFav.novel_id);
          if (favNovel) favourites.push(favNovel);
        });
      },
    );
    return favourites;
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
