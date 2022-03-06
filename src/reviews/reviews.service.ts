import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { createReviewDto } from './create-review.dto';
import { Review } from './reviews.model';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review) private reviewRepository: typeof Review) {}

  async createReview(userId: number, dto: createReviewDto) {
    let review = await this.reviewRepository.findOne({
      where: { userId: userId, novelId: dto.novelId },
    });
    if (!review) {
      review = await this.reviewRepository.create({
        userId: userId,
        novelId: dto.novelId,
        content: dto.content,
      });
    }
    return review;
  }
  async updateReview(userId: number, dto: createReviewDto) {
    let review = await this.reviewRepository.findOne({
      where: { novelId: dto.novelId, userId: userId },
    });
    if (review) review.update({ content: dto.content });
  }

  async deleteReview(userId: number, novelId: number) {
    let review = await this.reviewRepository.findOne({
      where: { novelId, userId },
    });
    if (review) review.destroy();
  }

  async getLatestReviews(novelId: number, amount: number) {
    let reviews = await this.reviewRepository.findAll({
      where: { novelId },
    });
    reviews.sort((a, b) => {
      if (a.createdAt < b.createdAt) return -1;
      if (a.createdAt > b.createdAt) return 1;
    });
    if (amount >= reviews.length) {
      return reviews;
    } else {
      return reviews.slice(0, amount - 1);
    }
  }
}
