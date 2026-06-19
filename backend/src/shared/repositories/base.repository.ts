export interface BaseRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
}
