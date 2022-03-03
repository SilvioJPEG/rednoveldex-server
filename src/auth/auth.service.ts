import {
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { Tokens } from './types/Tokens';
import { User } from 'src/users/users.model';

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
    const jwtPayload = {
      sub: user_id,
      username: username,
    };
    const [accessToken, refreshToken] = await Promise.all([
      //access token
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '15m',
      }),
      //refresh token
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '7d',
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.getUserByName(userDto.username);
    if (!user) throw new ForbiddenException('Access Denied');
    const passwordMatches = await argon.verify(user.password, userDto.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    return user;
  }

  async registration(userDto: CreateUserDto): Promise<Tokens> {
    const candidate = await this.usersService.checkIfExists(userDto.username);
    if (candidate) {
      throw new HttpException(
        'This username was used by another user. Try entering another one.',
        400,
      );
    }
    const hashPassword = await argon.hash(userDto.password);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    const tokens = await this.generateTokens(user.username, user.id);
    user.update({ refreshToken: tokens.refreshToken});
    return tokens;
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const { accessToken, refreshToken } = await this.generateTokens(
      user.username,
      user.id,
    );
    this.usersService.updateRefreshToken(user.id, refreshToken);
    const profile = await this.usersService.getUserProfile(user.username);
    return { user: profile, accessToken, refreshToken };
  }

  async logout(userId: number) {
    await this.usersService.deleteRefreshToken(userId);
    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.usersService.getUserById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.refreshToken, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateTokens(user.username, user.id);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
