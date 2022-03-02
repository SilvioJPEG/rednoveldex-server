import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Novel } from 'src/novels/novels.model';
import { JournalOfNovels } from './journal-of-novels.model';
import { Journal } from './journal.model';

@Injectable()
export class JournalService {
  constructor(
    @InjectModel(Journal) private journalRepository: typeof Journal,
    @InjectModel(JournalOfNovels) private JONRepository: typeof JournalOfNovels,
    @InjectModel(Novel) private novelRepository: typeof Novel,
  ) {}

  async getByOwnerId(ownerId: number) {
    const journal = await this.journalRepository.findOne({
      where: { ownerId },
    });
    const JON = await this.JONRepository.findAll({
      where: { journalId: journal.id },
    });
    let novels: Novel[] = [];
    JON.forEach(async (el) => {
      const novel = await this.novelRepository.findByPk(el.novelId);
      novels.push(novel);
    });
    return novels;
  }
  async update(journalUpdateDto) {
      //TODO
  }
}
