import { SharedRepository } from 'src/shared/shared.repository';
import { CreateTokenDto } from './dto/create-token.dto';
import { Token } from './schemas/token.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DateTime } from 'luxon';

@Injectable()
export class TokenRepository extends SharedRepository<Token, CreateTokenDto> {
  constructor(@InjectModel(Token.name) model: Model<Token>) {
    super(model);
  }

  findByIdentifier(params: { token?: string; identifier: string }) {
    const expirationTime = DateTime.now().minus({ minutes: 10 }).toJSDate();
    return this.model.findOne({
      ...params,
      $and: [{ createdAt: { $gt: expirationTime } }],
    });
  }
}
