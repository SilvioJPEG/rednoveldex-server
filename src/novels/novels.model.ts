import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
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

  @Column({ type: DataType.STRING, unique: true })
  description: string;

  @Column({ type: DataType.DATE })
  releaseDate: Date;

  @Column({ type: DataType.STRING })
  poster: string;

  @BelongsToMany(() => User, () => userFavourites)
  user: User[];
}
