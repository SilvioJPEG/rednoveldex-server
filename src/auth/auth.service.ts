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
import { Tokens } from './types/Tokens';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async generateTokens(
    username: string,
    user_id: number,
  ): Promise<Tokens> {
    const payload = { username: username, id: user_id };
    const [accessToken, refreshToken] = await Promise.all([
      //access token
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 15,
      }),
      //refresh token
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);
    return {
      refreshToken,
      accessToken,
    };
  }

  private async validateUser(userDto: CreateUserDto): Promise<any> {
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

  async registration(userDto: CreateUserDto): Promise<Tokens> {
    console.log(userDto);
    const candidate = await this.usersService.getUserByName(userDto.username);
    if (candidate) {
      throw new HttpException(
        'This username was used by another user. Try entering another one.',
        400,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 8);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    const tokens = await this.generateTokens(user.username, user.id);
    user.update({accessToken: tokens.accessToken});
    return tokens;
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const { accessToken, refreshToken } = await this.generateTokens(
      user.username,
      user.id,
    );
    const profile = await this.usersService.getUserProfile(user.username);
    return { user: profile, accessToken, refreshToken };
  }

  private saveAccessToken() {
  }
}
