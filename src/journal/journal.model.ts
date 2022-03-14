import {
  BelongsToMany,
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Novel } from 'src/novels/novels.model';
import { User } from 'src/users/users.model';
import { JournalEntity } from './journal-entity.model';

//поля необходимые для создания объекта
interface JournalCreationAttrs {
  owner_id: number;
}

@Table({ tableName: 'journals' })
export class Journal extends Model<Journal, JournalCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @HasMany(() => JournalEntity)
  entities: JournalEntity[];

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  owner_id: number;
  @BelongsTo(() => User)
  user: User;
}
