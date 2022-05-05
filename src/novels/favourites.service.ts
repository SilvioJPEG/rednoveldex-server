import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddNovelDto } from './add-novel.dto';
import { Novel } from './novels.model';
import { userFavourites } from './user-favourites.model';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectModel(Novel) private novelRepository: typeof Novel,
    @InjectModel(userFavourites) private UFRep: typeof userFavourites,
  ) {}

  async updateFavourites(novel_id: number, user_id: number) {
    const inFavourites = (await this.checkIfFavourited(novel_id, user_id))
      .InFavourites;
    if (inFavourites) {
      const unfavourited = await this.UFRep.destroy({
        where: { user_id, novel_id },
      });
      return unfavourited;
    } else {
      const favourited = await this.UFRep.create({ user_id, novel_id });
      return favourited;
    }
  }
  async checkIfFavourited(
    novel_id: number,
    user_id: number,
  ): Promise<{ InFavourites: boolean }> {
    const novel = await this.UFRep.findOne({
      where: {
        novel_id: novel_id,
        user_id: user_id,
      },
    });
    if (novel) {
      return { InFavourites: true };
    } else {
      return { InFavourites: false };
    }
  }

  async getFavouritesByUser(user_id: number): Promise<Novel[]> {
    const userFavourites = await this.UFRep.findAll({ where: { user_id } });
    let favourites: Novel[] = [];
    let favNovel: Novel;
    for (const element of userFavourites) {
      favNovel = await this.novelRepository.findByPk(element.novel_id);
      if (favNovel) {
        favourites.push(favNovel);
      }
    }
    return favourites;
  }
}
