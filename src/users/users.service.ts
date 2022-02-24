import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
  }
  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }
  async getUserByName(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
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
}
