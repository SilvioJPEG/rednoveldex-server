import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Novel } from 'src/novels/novels.model';
import { Journal } from '../journal/journal.model';

interface JournalOfNovelsAttrs {
    novelId: number;
    journalId: number;
}

@Table({ tableName: 'journal_of_novels' })
export class JournalOfNovels extends Model<
  JournalOfNovels,
  JournalOfNovelsAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Novel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  novelId: number;

  @ForeignKey(() => Journal)
  @Column({ type: DataType.INTEGER, allowNull: false })
  journalId: number;
}
