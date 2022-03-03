import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Journal } from 'src/journal/journal.model';
import { List } from 'src/lists/lists.model';
import { Novel } from 'src/novels/novels.model';
import { Review } from 'src/reviews/reviews.model';
import { userFavourites } from '../novels/user-favourites.model';

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

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'regular' })
  role: string;

  @Column({ type: DataType.STRING })
  avatar: string;

  @Column({ type: DataType.STRING })
  bio: string;

  @Column({ type: DataType.STRING })
  location: string;

  //each user may have some favourites
  @BelongsToMany(() => Novel, () => userFavourites)
  favourites: Novel[];

  //each user may create list of novels
  @HasMany(() => List)
  listsOfNovels: List[];

  @HasMany(() => Review)
  reviews: Review[];

  @HasOne(() => Journal)
  journal: Journal;

  @Column({ type: DataType.STRING })
  accessToken: string;
}
