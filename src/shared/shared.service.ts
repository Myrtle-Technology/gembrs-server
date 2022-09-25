import { SharedRepository } from './shared.repository';

export class SharedService<Repo> {
  constructor(readonly repo: Repo) {}
}
