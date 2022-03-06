import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsNumber} from "class-validator";

export class createReviewDto {
    
    @ApiProperty({example: 'This novel is fantastic...', description: 'text of a review'})
    @IsString({message: 'Must be a string'})
    readonly content: string;
    
    @IsNumber()
    readonly novelId: number;
}