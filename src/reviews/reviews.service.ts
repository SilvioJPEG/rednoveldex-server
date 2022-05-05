import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Novel } from 'src/novels/novels.model';
import { User } from 'src/users/users.model';
import {
  createReviewDto,
  ReviewBasic,
  updateReviewDto,
} from './create-review.dto';
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
      include: [
        {
          model: Novel,
          where: { id: dto.novel_id },
          attributes: ['image', 'title', 'id'],
        },
        {
          model: User,
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });
    if (!review) {
      review = await this.reviewRepository.create({
        user_id: user_id,
        novel_id: dto.novel_id,
        content: dto.content,
      });
      review = await this.reviewRepository.findByPk(review.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'avatar'],
          },
        ],
        attributes: ['content', 'updatedAt'],
      });
    }
    return review;
  }
  async updateReview(user_id: number, dto: updateReviewDto): Promise<Review> {
    let review = await this.reviewRepository.findOne({
      where: { novel_id: dto.novel_id, user_id: user_id },
    });
    if (review) review.update({ content: dto.content });
    return review;
  }

  async deleteReview(user_id: number, novel_id: number) {
    let review = await this.reviewRepository.findOne({
      where: { novel_id, user_id },
    });
    if (review) review.destroy();
  }

  async getLatestReviewsByNovel(
    novel_id: number,
    amount: number,
  ): Promise<Review[]> {
    let reviews = await this.reviewRepository.findAll({
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'content', 'updatedAt'],
      include: [
        {
          model: Novel,
          where: { id: novel_id },
          attributes: ['image', 'title', 'id'],
        },
        {
          model: User,
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });
    if (amount < reviews.length) {
      reviews = reviews.slice(0, amount - 1);
    }

    return reviews;
  }

  async checkIfAlreadyPosted(
    user_id: number,
    novel_id: number,
  ): Promise<Review> {
    let review = await this.reviewRepository.findOne({
      where: { novel_id, user_id },
      attributes: ['id', 'content', 'updatedAt'],
      include: [
        { model: Novel, attributes: ['id', 'image', 'title'] },
        { model: User, attributes: ['username', 'avatar'] },
      ],
    });
    return review;
  }

  async getLatestReviewOverall(): Promise<Review[]> {
    const reviews = await this.reviewRepository.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: Novel, attributes: ['id', 'image', 'title'] }],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    return reviews.slice(0, 10);
  }

  async getReviewsByUser(username: string): Promise<Review[]> {
    let user = await this.userRepository.findOne({
      where: { username: username },
    });
    let reviews = await this.reviewRepository.findAll({
      include: [
        { model: Novel, attributes: ['id', 'image', 'title'] },
        { model: User, attributes: ['username', 'avatar'] },
      ],
      order: [['createdAt', 'DESC']],
      where: { user_id: user.id },
      attributes: ['id', 'content', 'updatedAt'],
    });
    return reviews;
  }
}
