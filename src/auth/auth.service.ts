import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async generateToken(user: User) {
    const payload = { username: user.username, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.getUserByName(userDto.username);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Invalid username or password',
    });
  }

  async registration(userDto: CreateUserDto) {
    const candidate = this.usersService.getUserByName(userDto.username);
    if (candidate) {
      throw new HttpException(
        'This email was used by another user. Try entering another email',
        400,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 8);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }
}
