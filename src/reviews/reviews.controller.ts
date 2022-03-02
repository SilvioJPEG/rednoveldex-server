import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createReviewDto } from './create-review.dto';
import { Review } from './reviews.model';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'review creation' })
  @ApiResponse({ status: 200, type: Review })
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() reviewDto: createReviewDto) {
    return this.reviewsService.createReview(reviewDto);
  }

  //get a specific amount of reviews for novel with novelId
  @Get('/:novelId/:amount')
  getLatestReviews(
    @Param('novelId') novelId: number,
    @Param('amount') amount: number,
  ) {
    return this.reviewsService.getLatestReviews(novelId, amount);
  }

  //update review content
  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: createReviewDto) {
    return this.reviewsService.updateReview(dto);
  }

  //delete review
  @Delete('/:userId/:novelId/')
  @UseGuards(JwtAuthGuard)
  delete(@Param('userId') userId: number, @Param('novelId') novelId: number) {
    return this.reviewsService.deleteReview(userId, novelId);
  }
}
