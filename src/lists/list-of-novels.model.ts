// import {
//   BelongsToMany,
//   Column,
//   DataType,
//   ForeignKey,
//   Model,
//   Table,
// } from 'sequelize-typescript';
// import { Novel } from 'src/novels/novels.model';
// import { User } from 'src/users/users.model';
// import { List } from './lists.model';

// interface NovelCreationAttrs {
//   title: string;
// }

// @Table({ tableName: 'List_of_novels' })
// export class ListOfNovels extends Model<ListOfNovels, NovelCreationAttrs> {
//   @Column({
//     type: DataType.INTEGER,
//     unique: true,
//     autoIncrement: true,
//     primaryKey: true,
//   })
//   id: number;

//   @ForeignKey(() => Novel)
//   @Column({ type: DataType.NUMBER, allowNull: false })
//   novel_id: number;

//   @ForeignKey(() => List)
//   @Column({ type: DataType.NUMBER, allowNull: false })
//   list_id: number;
// }
