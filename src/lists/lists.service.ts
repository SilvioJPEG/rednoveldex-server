import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateListDto } from './create-list.dto';
import { List } from './lists.model';

@Injectable()
export class ListsService {
  constructor(@InjectModel(List) private ListRepository: typeof List) {}

  async getListByUser(user_id: number) {
    let list = await this.ListRepository.findOne({ where: { user_id: user_id } });
    return list;
  }

  async createList(dto: CreateListDto) {
    let list = await this.ListRepository.create(dto);
    return list;
  }

  async UpdateList(updatedList: List) {

  }

  async deleteList() {
    let list = await this.ListRepository.findOne({ where: {} });
    if (list) {
      list.destroy();
    }
  }
}
