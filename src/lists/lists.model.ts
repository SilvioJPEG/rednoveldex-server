import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';

//поля необходимые для создания объекта
interface ListCreationAttrs {
  username: string;
  password: string;
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

  @ForeignKey(() => User)
  @Column({ type: DataType.NUMBER, allowNull: false })
  author_id: number;
}
