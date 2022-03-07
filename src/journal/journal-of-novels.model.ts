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
    novel_id: number;
    journal_id: number;
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
  novel_id: number;

  @ForeignKey(() => Journal)
  @Column({ type: DataType.INTEGER, allowNull: false })
  journal_id: number;
}
