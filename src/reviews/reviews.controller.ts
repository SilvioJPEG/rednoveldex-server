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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createReviewDto, updateReviewDto } from './create-review.dto';
import { Review } from './reviews.model';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'get latest reviews overall' })
  @ApiResponse({ status: 200, type: [Review] })
  @Get()
  getLatestReviewsOverall() {
    return this.reviewsService.getLatestReviewOverall();
  }

  @ApiOperation({ summary: 'review creation' })
  @ApiResponse({ status: 200, type: Review })
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() reviewDto: createReviewDto) {
    return this.reviewsService.createReview(req.user.sub, reviewDto);
  }

  @ApiOperation({ summary: 'Get :amount of latest reviews for :novel_id' })
  @ApiResponse({ status: 200, type: [Review] })
  @Get()
  @HttpCode(HttpStatus.OK)
  getLatestReviewsByNovel(
    @Query('novel_id') novel_id: number,
    @Query('amount') amount: number,
    @Query('username') username: string,
  ) {
    return this.reviewsService.getReviews(novel_id, amount, username);
  }

  @ApiOperation({ summary: "Update review's text, return created review data" })
  @ApiResponse({ status: 200, type: Review })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  update(@Req() req, @Body() dto: updateReviewDto) {
    return this.reviewsService.updateReview(req.user.sub, dto);
  }

  @ApiOperation({ summary: 'Deletes review by id' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  delete(@Req() req, @Param('review_id') id: number) {
    this.reviewsService.deleteReview(id);
  }

  @ApiOperation({ summary: 'Checks if current user has review for :novel_id' })
  @ApiResponse({ status: 200 })
  @Get('check')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  get(@Req() req, @Query('novel_id') novel_id: number) {
    return this.reviewsService.checkIfAlreadyPosted(req.user.sub, novel_id);
  }
}
