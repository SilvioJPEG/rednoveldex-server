import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { JournalEntity } from 'src/journal/journal-entity.model';

import { Journal } from 'src/journal/journal.model';
import { ListOfNovels } from 'src/lists/list-of-novels.model';
import { List } from 'src/lists/lists.model';
import { userFavourites } from 'src/novels/user-favourites.model';
import { Review } from 'src/reviews/reviews.model';
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
  aliases: string;

  @Column({ type: DataType.STRING })
  orig_lang: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.DATE })
  release_date: string;

  @Column({ type: DataType.STRING })
  image: string;

  @Column({ type: DataType.BOOLEAN })
  explicit: boolean;

  //user can add it to favourites
  @BelongsToMany(() => User, () => userFavourites)
  user: User[];

  //novel can be added to multiple different lists
  @BelongsToMany(() => List, () => ListOfNovels)
  lists: List[];

  @BelongsToMany(() => Journal, () => JournalEntity)
  journals: Journal[];

  @HasMany(() => Review)
  reviews: Review[];
}
