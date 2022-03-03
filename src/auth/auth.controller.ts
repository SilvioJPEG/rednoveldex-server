import { Body, Controller, HttpCode, HttpStatus, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.model';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
const Public = () => SetMetadata('isPublic', true);
@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  @HttpCode(HttpStatus.CREATED)
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
  

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() request) {
    const user = request.user;
    console.log(user);
    return this.authService.logout(user.sub);
  }
  
  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  refreshTokens() {}
}
