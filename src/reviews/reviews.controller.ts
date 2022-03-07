import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { createReviewDto } from './create-review.dto';
import { Review } from './reviews.model';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private reviewsService: ReviewsService,
    private usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'review creation' })
  @ApiResponse({ status: 200, type: Review })
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() reviewDto: createReviewDto) {
    console.log(reviewDto);
    return this.reviewsService.createReview(req.user.sub, reviewDto);
  }

  @ApiOperation({ summary: 'Get :amount of latest reviews' })
  @ApiResponse({ status: 200, type: [Review] })
  @Get('/:novel_id/:amount')
  @HttpCode(HttpStatus.OK)
  async getLatestReviews(
    @Param('novel_id') novel_id: number,
    @Param('amount') amount: number,
  ) {
    let reviews = await this.reviewsService.getLatestReviews(novel_id, amount);

    return reviews;
  }

  @ApiOperation({ summary: "Update review's text, return created review data" })
  @ApiResponse({ status: 200, type: Review })
  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  update(@Req() req, @Body() dto: createReviewDto) {
    return this.reviewsService.updateReview(req.user.sub, dto);
  }

  @ApiOperation({ summary: 'Deletes review by id' })
  @ApiResponse({ status: 200 })
  @Delete('/:novelId/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  delete(@Req() req, @Param('novelId') novel_id: number) {
    return this.reviewsService.deleteReview(req.user.sub, novel_id);
  }
}
