import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Novel } from 'src/novels/novels.model';
import { userFavourites } from './user-favourites';

//поля необходимые для создания объекта
interface UserCreationAttrs {
  username: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true })
  username: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  email: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  password: string;

  @Column({ type: DataType.STRING, defaultValue: 'regular' })
  role: string;

  @Column({ type: DataType.STRING })
  avatar: string;

  @BelongsToMany(() => Novel, () => userFavourites)
  favourites: Novel[];
}
