import { SharedRepository } from 'src/shared/shared.repository';
import { CreateTokenDto } from './dto/create-token.dto';
import { Token } from './schemas/token.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isEmail } from 'class-validator';

@Injectable()
export class TokenRepository extends SharedRepository<Token, CreateTokenDto> {
  constructor(@InjectModel(Token.name) model: Model<Token>) {
    super(model);
  }

  findTokenByUser(userId: string) {
    return this.model.findOne({ user: userId });
  }
}
