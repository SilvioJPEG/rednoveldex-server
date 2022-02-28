import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { ListOfNovels } from 'src/lists/list-of-novels.model';
import { List } from 'src/lists/lists.model';
import { userFavourites } from 'src/users/user-favourites.model';
import { User } from 'src/users/users.model';

interface NovelCreationAttrs {
  title: string
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
  releaseDate: Date;

  @Column({ type: DataType.STRING })
  poster: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false})
  urlPath: string;

  //user can add it ti favourites
  @BelongsToMany(() => User, () => userFavourites)
  user: User[];

  //novel can be added to multiple different lists 
  @BelongsToMany(() => List, () => ListOfNovels)
  lists: List[];


}
