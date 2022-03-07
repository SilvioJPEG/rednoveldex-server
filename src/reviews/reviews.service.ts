import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { createReviewDto } from './create-review.dto';
import { Review } from './reviews.model';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async createReview(user_id: number, dto: createReviewDto) {
    let review = await this.reviewRepository.findOne({
      where: { user_id: user_id, novel_id: dto.novel_id },
    });
    if (!review) {
      review = await this.reviewRepository.create({
        user_id: user_id,
        novel_id: dto.novel_id,
        content: dto.content,
      });
    }
    return review;
  }
  async updateReview(user_id: number, dto: createReviewDto) {
    let review = await this.reviewRepository.findOne({
      where: { novel_id: dto.novel_id, user_id: user_id },
    });
    if (review) review.update({ content: dto.content });
  }

  async deleteReview(user_id: number, novel_id: number) {
    let review = await this.reviewRepository.findOne({
      where: { novel_id, user_id },
    });
    if (review) review.destroy();
  }

  async getLatestReviews(novel_id: number, amount: number) {
    let reviews = await this.reviewRepository.findAll({
      where: { novel_id },
    });
    reviews.sort((a, b) => {
      if (a.createdAt < b.createdAt) return -1;
      if (a.createdAt > b.createdAt) return 1;
    });
    if (amount < reviews.length) {
      reviews = reviews.slice(0, amount - 1);
    }
    let resBody = await Promise.all(
      reviews.map(async (review: Review) => {
        let user = await this.userRepository.findByPk(review.user_id);
        return {
          user: { username: user.username, avatar: user.avatar },
          content: review.content,
        };
      }),
    );
    return resBody;
  }
}
