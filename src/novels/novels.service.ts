import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AddNovelDto } from './add-novel.dto';
import { Novel } from './novels.model';
const VNDB = require('vndb-api');
@Injectable()
export class NovelsService {
  constructor(@InjectModel(Novel) private novelRepository: typeof Novel) {}

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

  async searchFor(search: string) {
    const novels = await this.novelRepository.findAll({
      where: { title: { [Op.like]: `%${search}%` } },
    });
    if (novels) {
      const results = novels.map((element: Novel) => {
        return { id: element.id, title: element.title, poster: element.image };
      });
      console.log(results);
      return results;
    } else return [];
  }

  async findInVNDB(title: string) {
    // Create a client
    const vndb = new VNDB('rednovel', { minConnection: 1, maxConnection: 10 });
    let items = await vndb
      .query(`get vn basic,details,anime (title ~ "${title}")`)
      .then((response) => {
        return response.items;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        vndb.destroy();
      });
    console.log(items);
    return items[0];
  }
}
