export interface UpdateEmailTemplateInputDto {
   subject?: string;
   body?: string;
}

export interface UpdateEmailTemplateRequestDTO {
  id: string;
  input: UpdateEmailTemplateInputDto;
}