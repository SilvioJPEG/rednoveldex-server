import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Journal } from 'src/journal/journal.model';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Journal) private journalRepository: typeof Journal,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    await this.journalRepository.create({ owner_id: user.id });
    return user;
  }
  async checkIfExists(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    return user;
  }
  async getUser(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      attributes: ['username', 'avatar', 'createdAt', 'bio', 'location'],
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findByPk(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
  async getUserFull(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async getUserProfile(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: username },
      attributes: ['username', 'avatar', 'createdAt', 'bio', 'location'],
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) throw new NotFoundException('user not found');
    user.update({ refreshToken: refreshToken });
    return user;
  }

  async deleteRefreshToken(userId: number) {
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException('user not found');
    await user.update({ refreshToken: null });
  }

  async updateUserData(userId: number, newData: User) {
    const user = await this.userRepository.findByPk(userId);
    return await user.update(newData);
  }
  async deleteUser(userId: number) {
    const user = await this.userRepository.findByPk(userId);
    //TODO: delete not only user but instances in other databases as well
  }
}
