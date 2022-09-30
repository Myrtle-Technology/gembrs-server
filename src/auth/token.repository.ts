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

  findByIdentifier(token: string, identifier: string) {
    return this.model.findOne({
      token,
      identifier,
      // $and: [{ createdAt: { $gt: new Date() } }],
    });
  }
}
