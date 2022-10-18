import { Member } from '../schemas/member.schema';

export class MemberCreatedEvent {
  static eventName = 'member.created';

  constructor(readonly member: Member, readonly notifyMember: boolean) {}
}
