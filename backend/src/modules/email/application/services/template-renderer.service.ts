export class TemplateRendererService {
  render(
    template: string,
    variables: Record<string, string>,
  ): string {
    return template.replace(
      /\{\{\s*([^}]+?)\s*\}\}/g,
      (_, key) => variables[key.trim()] ?? `{{${key}}}`,
    );
  }
}