
export interface IAnalyzeApplicationUseCase {
  execute(applicationId: string): Promise<void>;
}