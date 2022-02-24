import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
//контроллер должен оставаться тонким, всю логику стоит выносить в service
@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}


}
