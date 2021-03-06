import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Novel } from 'src/novels/novels.model';
import { JournalEntity } from './journal-entity.model';

import { Journal } from './journal.model';
import { updateEntityDto } from './update-journal.dto';
@Injectable()
export class JournalService {
  constructor(
    @InjectModel(Journal) private journalRepository: typeof Journal,
    @InjectModel(JournalEntity) private entityRepository: typeof JournalEntity,
    @InjectModel(Novel) private novelRepository: typeof Novel,
  ) {}

  async getJournalByOwnerId(owner_id: number): Promise<JournalEntity[]> {
    this.entityRepository.belongsTo(Novel, { foreignKey: 'novel_id' });
    const entities = await this.entityRepository.findAll({
      include: [
        { model: Novel, attributes: ['id', 'image', 'title'] },
        { model: Journal, where: { owner_id: owner_id }, attributes: [] },
      ],
      attributes: ['score', 'status', 'started_reading', 'finished_reading'],
    });
    return entities;
  }

  async addEntity(user_id: number, novel_id: number): Promise<JournalEntity> {
    const journal = await this.journalRepository.findOne({
      where: { owner_id: user_id },
    });
    if (!journal) throw new NotFoundException('journal not found');
    const { InJournal, novelEntry } = await this.checkIfInJournal(
      user_id,
      novel_id,
    );
    if (!InJournal) {
      const entity = await this.entityRepository.create({
        novel_id: novel_id,
        journal_id: journal.id,
      });
      const res = await this.entityRepository.findByPk(entity.id, {
        include: [
          {
            model: Novel,
            where: { id: novel_id },
            attributes: ['id', 'title', 'image'],
          },
        ],
      });
      return res;
    } else {
      return novelEntry;
    }
  }
  async deleteEntity(user_id: number, novel_id: number) {
    const journal = await this.journalRepository.findOne({
      where: { owner_id: user_id },
    });
    if (!journal) throw new NotFoundException('journal not found');
    const { InJournal, novelEntry } = await this.checkIfInJournal(
      user_id,
      novel_id,
    );

    if (InJournal) {
      this.entityRepository.destroy({ where: { id: novelEntry.id } });
    }
  }

  async updateEntry(
    user_id: number,
    novel_id: number,
    updateJournalDto: updateEntityDto,
  ): Promise<JournalEntity> {
    let entity = await this.entityRepository.findOne({
      where: { journal_id: user_id, novel_id },
    });
    if (!entity) {
      throw new Error('No entity found for update');
    }
    entity = await entity.update(updateJournalDto);
    return await this.entityRepository.findByPk(entity.id, {
      attributes: ['status', 'score', 'finished_reading', 'started_reading'],
      include: [
        {
          model: Novel,
          where: { id: novel_id },
          attributes: ['id', 'title', 'image'],
        },
      ],
    });
  }

  async checkIfInJournal(user_id: number, novel_id: number) {
    const journal = await this.journalRepository.findOne({
      where: { owner_id: user_id },
    });
    if (!journal) throw new NotFoundException('journal not found');
    const novelEntry = await this.entityRepository.findOne({
      where: { novel_id: novel_id, journal_id: journal.id },
      include: [{ model: Novel, attributes: ['id', 'image', 'title'] }],
    });
    if (novelEntry) {
      return { InJournal: true, novelEntry };
    } else {
      return { InJournal: false, novelEntry };
    }
  }

  async getJournalLength(user_id: number): Promise<{ journalLength: number }> {
    const entities = await this.entityRepository.findAndCountAll({
      where: { journal_id: user_id },
    });
    if (!entities) throw new NotFoundException('journal length not found');
    return { journalLength: entities.count };
  }

  async getAverageScore(novel_id: number): Promise<{ score: number }> {
    const entities = await this.entityRepository.findAndCountAll({
      where: { novel_id },
    });
    if (entities.count === 0) {
      return { score: 0 };
    }
    const averageScore =
      entities.rows.reduce((accumulator, curr) => {
        return accumulator + curr.score;
      }, 0) / entities.count;
    return { score: averageScore };
  }
}
