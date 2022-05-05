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
    return InJournal;
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
    });
    if (novelEntry) {
      return { InJournal: true, novelEntry };
    } else {
      return { InJournal: false, novelEntry };
    }
  }

  async getJournalLength(user_id: number): Promise<{ journalLength: number }> {
    const journals = await this.entityRepository.findAndCountAll({
      where: { journal_id: user_id },
    });
    console.log(journals.count);
    if (!journals) throw new NotFoundException('journal length not found');
    return { journalLength: journals.count };
  }
}
