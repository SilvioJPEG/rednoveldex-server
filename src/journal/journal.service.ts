import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Novel } from 'src/novels/novels.model';
import { JournalEntity } from './journal-entity.model';

import { Journal } from './journal.model';
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
        { model: Journal, where: { id: owner_id }, attributes: [] },
      ],
      attributes: ['score', 'status', 'started_reading', 'finished_reading'],
    });
    console.log
    return entities;
  }

  async update(user_id: number, novel_id: number) {
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
    } else {
      this.entityRepository.create({
        novel_id: novel_id,
        journal_id: journal.id,
      });
    }
  }

  async checkIfInJournal(user_id: number, novel_id: number) {
    const journal = await this.journalRepository.findOne({
      where: { owner_id: user_id },
    });
    if (!journal) throw new NotFoundException('journal not found');
    const novelEntry = await this.entityRepository.findOne({
      where: { novel_id: novel_id, journal_id: journal.id },
    });
    if (novelEntry) {
      return { InJournal: true, novelEntry };
    } else {
      return { InJournal: false, novelEntry };
    }
  }

  async getJournalLength(user_id: number): Promise<{ journalLength: number }> {
    const journal = await this.journalRepository.findAll({
      where: { owner_id: user_id },
    });
    if (!journal) throw new NotFoundException('journal not found');
    return { journalLength: journal.length };
  }
}
