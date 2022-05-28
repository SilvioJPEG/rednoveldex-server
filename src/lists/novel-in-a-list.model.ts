import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Novel } from 'src/novels/novels.model';
import { List } from './lists.model';

interface ListOfNovelsAttrs {
  novel_id: number;
  list_id: number;
}

@Table({ tableName: 'novel_in_list' })
export class NovelInListEntity extends Model<NovelInListEntity, ListOfNovelsAttrs> {
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

  @ForeignKey(() => List)
  @Column({ type: DataType.INTEGER, allowNull: false })
  list_id: number;
}
