import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Novel } from 'src/novels/novels.model';
import { Journal } from '../journal/journal.model';

interface JournalEntitysAttrs {
  novel_id: number;
  journal_id: number;
}

@Table({ tableName: 'journal_entities' })
export class JournalEntity extends Model<JournalEntity, JournalEntitysAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.DATE })
  started_reading: number;

  @Column({ type: DataType.DATE })
  finished_reading: number;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'reading' })
  status: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  score: number;

  @Column({ type: DataType.TEXT})
  comments: string;

  @ForeignKey(() => Novel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  novel_id: number;
  @BelongsTo(() => Novel)
  Novel: Novel;

  @ForeignKey(() => Journal)
  @Column({ type: DataType.INTEGER, allowNull: false })
  journal_id: number;
  @BelongsTo(() => Journal)
  journal: Journal;
}
