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
  novelId: number;
  listId: number;
}

@Table({ tableName: 'list_of_novels' })
export class ListOfNovels extends Model<ListOfNovels, ListOfNovelsAttrs> {
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

  @ForeignKey(() => List)
  @Column({ type: DataType.INTEGER, allowNull: false })
  listId: number;

}
