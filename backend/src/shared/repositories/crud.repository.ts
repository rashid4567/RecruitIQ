import { BaseRepository } from "./base.repository";

export interface CrudRepository<T, ID = string>
  extends BaseRepository<T, ID> {
  save(entity: T): Promise<void>;
}