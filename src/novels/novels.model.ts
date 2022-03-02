import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { JournalOfNovels } from 'src/journal/journal-of-novels.model';
import { Journal } from 'src/journal/journal.model';
import { ListOfNovels } from 'src/lists/list-of-novels.model';
import { List } from 'src/lists/lists.model';
import { userFavourites } from 'src/novels/user-favourites.model';
import { User } from 'src/users/users.model';

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

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.DATE })
  releaseDate: number;

  @Column({ type: DataType.STRING })
  poster: string;

  //user can add it to favourites
  @BelongsToMany(() => User, () => userFavourites)
  user: User[];

  //novel can be added to multiple different lists
  @BelongsToMany(() => List, () => ListOfNovels)
  lists: List[];

  @BelongsToMany(() => Journal, () => JournalOfNovels)
  journals: Journal[];
}
