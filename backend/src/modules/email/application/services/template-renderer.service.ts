export class TemplateRendererService {
  render(
    template: string,

    variables: Record<string, string>,
  ): string {
    return template.replace(
      /\{\{(\w+)\}\}/g,

      (_, key) => {
        return variables[key] ?? `{{${key}}}`;
      },
    );
  }
}
