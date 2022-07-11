import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Novel } from 'src/novels/novels.model';
import { CreateListDto } from './create-list.dto';
import { NovelInListEntity } from './novel-in-a-list.model';
import { List } from './lists.model';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(List) private ListRepository: typeof List,
    @InjectModel(NovelInListEntity)
    private NILERepository: typeof NovelInListEntity,
  ) {}

  async getListById(id: number): Promise<List> {
    const list = await this.ListRepository.findByPk(id, {
      include: [{ model: Novel, attributes: ['id', 'image', 'title'] }],
    });
    return list;
  }
  async getListsPreviewByUser(user_id: number): Promise<List[]> {
    const lists = await this.ListRepository.findAll({
      include: [
        {
          model: Novel,
          attributes: ['id', 'image', 'title', 'explicit'],
          through: { attributes: [] },
        },
      ],
      where: { user_id: user_id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'user_id'] },
    });
    for (let list of lists) {
      console.log(list);
    }
    return lists;
  }
  async getAmountByUser(user_id: number): Promise<{ listsAmount: number }> {
    const amount = (await this.getListsPreviewByUser(user_id)).length;
    return { listsAmount: amount };
  }
  async createList(dto: CreateListDto): Promise<List> {
    const list = await this.ListRepository.create(dto);
    for (const novel_id of dto.novels) {
      await this.NILERepository.create({ novel_id, list_id: list.id });
    }
    return list;
  }

  async updateList(id: number, updatedList: List): Promise<List> {
    const list = await this.ListRepository.update(updatedList, {
      where: { id },
    });
    if (list[0] === 1) {
      return list[1][1];
    } else {
      throw new NotFoundException('list not found');
    }
  }

  async deleteList(id: number) {
    const list = await this.ListRepository.findByPk(id);
    if (list) {
      list.destroy();
    }
  }
}
