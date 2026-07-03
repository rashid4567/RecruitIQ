export interface ApplicationNumberGenerator {
  generate(): Promise<string>;
}