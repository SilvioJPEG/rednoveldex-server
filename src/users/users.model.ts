import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ListOfNovels } from 'src/lists/list-of-novels.model';
import { List } from 'src/lists/lists.model';
import { Novel } from 'src/novels/novels.model';
import { Review } from 'src/reviews/reviews.model';
import { userFavourites } from './user-favourites.model';

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

  //each user have some favourites
  @BelongsToMany(() => Novel, () => userFavourites)
  favourites: Novel[];

  //each user may create list of novels
  @HasMany(() => List)
  listsOfNovels: List[];

  @HasMany(() => Review)
  review: Review[];
}
