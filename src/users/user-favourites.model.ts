import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Novel } from 'src/novels/novels.model';
import { User } from './users.model';

//поля необходимые для создания объекта
interface UserCreationAttrs {
  user_id: number;
  novel_id: number;
}

@Table({ tableName: 'user_favourites', createdAt: false, updatedAt: false })
export class userFavourites extends Model<userFavourites, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.NUMBER, allowNull: false })
  user_id: number;

  @ForeignKey(() => Novel)
  @Column({ type: DataType.NUMBER, allowNull: false })
  novel_id: number;
}
