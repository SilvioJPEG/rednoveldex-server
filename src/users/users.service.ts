import { HttpException, Injectable } from '@nestjs/common';
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
    await this.journalRepository.create({ ownerId: user.id });
    return user;
  }
  async checkIfExists(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    return user;
  }
  async getUserByName(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (user) return user;
    throw new HttpException('user not found', 404);
  }
  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (user) return user;
    throw new HttpException('user not found', 404);
  }

  async getUserProfile(username: string) {
    const user = await this.getUserByName(username);
    if (user) {
      const publicData = {
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
      };
      return publicData;
    }
    throw new HttpException('user not found', 404);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) throw new HttpException('user not found', 404);
    user.update({ refreshToken: refreshToken });
    return user;
  }

  async deleteRefreshToken(userId: number) {
    const user = await this.getUserById(userId);
    if (!user) throw new HttpException('user not found', 404);
    await user.update({ refreshToken: null });
  }
}
