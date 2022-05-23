import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AddNovelDto, novelVNDB } from './add-novel.dto';
import { Novel } from './novels.model';
const VNDB = require('vndb-api');
@Injectable()
export class NovelsService {
  constructor(@InjectModel(Novel) private novelRepository: typeof Novel) {}

  async getOne(id: number): Promise<Novel> {
    const novel = await this.novelRepository.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
    });
    return novel;
  }



  async create(title: string) {
    const vndb = new VNDB('rednovel', { minConnection: 1, maxConnection: 10 });
    let item: novelVNDB = await vndb
      .query(`get vn basic,details,anime (title ~ "${title}")`)
      .then((response) => {
        return response.items[0];
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        vndb.destroy();
      });
    const dto: AddNovelDto = {
      title: item.title,
      aliases: item.aliases,
      orig_lang: item.orig_lang[0],
      image: item.image,
      release_date: item.released,
      description: item.description,
    };
    const novel = await this.novelRepository.create(dto);
    return novel;
  }

  async getRecentlyAdded(amount: number) {
    const novels = await this.novelRepository.findAll({
      order: [['createdAt', 'DESC']],
      attributes: ['title', 'id', 'image', 'explicit'],
    });
    if (amount >= novels.length) {
      return novels;
    }
    return novels.slice(0, amount);
  }

  async searchFor(search: string) {
    const novels = await this.novelRepository.findAll({
      where: { title: { [Op.iLike]: `%${search}%` } },
      attributes: ['id', 'title', 'image'],
    });
    if (!novels) {
      throw new NotFoundException('not found');
    }
    return novels;
  }

  private async checkIfExists(title: string): Promise<boolean> {
    const novel = await this.novelRepository.findOne({
      where: { title: title },
    });
    if (novel !== null) {
      return true;
    } else {
      return false;
    }
  }

  async findInVNDB(title: string): Promise<string[]> {
    // Create a client
    const vndb = new VNDB('rednovel', { minConnection: 1, maxConnection: 10 });
    let titles: string[] = await vndb
      .query(`get vn basic,details,anime (title ~ "${title}")`)
      .then(async (response) => {
        let titles = await Promise.all(
          response.items.map(async (novel: novelVNDB) => {
            const bool = await this.checkIfExists(novel.title);
            if (!bool) return novel.title;
          }),
        );
        return titles;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        vndb.destroy();
      });
    return titles.filter((el) => {
      return el !== undefined;
    });
  }
}
