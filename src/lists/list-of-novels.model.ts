import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { List } from './lists.model';

interface NovelCreationAttrs {
  title: string;
}

@Table({ tableName: 'novels' })
export class Novel extends Model<Novel, NovelCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Novel)
  @Column({ type: DataType.NUMBER, allowNull: false })
  novel_id: number;

  @ForeignKey(() => List)
  @Column({ type: DataType.NUMBER, allowNull: false })
  list_id: number;
}
