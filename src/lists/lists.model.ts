import {
  BelongsToMany,
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { Novel } from 'src/novels/novels.model';
import { User } from 'src/users/users.model';
import { ListOfNovels } from './list-of-novels.model';

//поля необходимые для создания объекта
interface ListCreationAttrs {
  title: string;
  userId: number;
}

@Table({ tableName: 'lists' })
export class List extends Model<List, ListCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING })
  description: string;

  @BelongsToMany(() => Novel, () => ListOfNovels)
  novels: Novel[];

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;
  @BelongsTo(() => User)
  user: User;
}
