import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Novel } from 'src/novels/novels.model';
import { User } from 'src/users/users.model';

//поля необходимые для создания объекта
interface ReviewCreationAttrs {
  content: string;
  userId: number;
  novelId: number;
}

@Table({ tableName: 'reviews' })
export class Review extends Model<Review, ReviewCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  content: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;
  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Novel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  novelId: number;
  @BelongsTo(() => Novel)
  novel: Novel;
}
