import { HttpException, Injectable } from '@nestjs/common';
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

  async getByOwnerId(owner_id: number) {
    const journal = await this.journalRepository.findOne({
      where: { owner_id },
    });
    const JON = await this.JONRepository.findAll({
      where: { journal_id: journal.id },
    });
    let novels: Novel[] = [];
    JON.forEach(async (el) => {
      const novel = await this.novelRepository.findByPk(el.novel_id);
      novels.push(novel);
    });
    return novels;
  }

  async update(user_id: number, novel_id: number) {
    const journal = await this.journalRepository.findOne({
      where: { owner_id: user_id },
    });
    if (!journal) throw new HttpException('journal not found', 404);
    const { InJournal, novelEntry } = await this.checkIfInJournal(
      user_id,
      novel_id,
    );
    if (InJournal) {
      this.JONRepository.destroy({ where: { id: novelEntry.id } });
    } else {
      this.JONRepository.create({ novel_id: novel_id, journal_id: (journal.id) });
    }
  }

  async checkIfInJournal(user_id: number, novel_id: number) {
    const journal = await this.journalRepository.findOne({
      where: { owner_id: user_id },
    });
    if (!journal) throw new HttpException('journal not found', 404);
    const novelEntry = await this.JONRepository.findOne({
      where: { novel_id: novel_id, journal_id: journal.id },
    });
    if (novelEntry) {
      return { InJournal: true, novelEntry };
    } else {
      return { InJournal: false, novelEntry };
    }
  }
}
