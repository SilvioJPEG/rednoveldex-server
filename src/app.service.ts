import { Injectable } from '@nestjs/common';
//в сервисе логика
@Injectable()
export class AppService {
  getUsers() {
    return [{id: 1, name:"alex"}];
  }
}
