import { type RefObject } from "react";
import { Code, Eye, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EmailTemplateForm } from "../../validaton/emailTemplate.schema";

interface EmailBodyEditorProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  form: EmailTemplateForm;
  setForm: React.Dispatch<React.SetStateAction<EmailTemplateForm>>;
  previewHtml: () => string;
}

export function EmailBodyEditor({ textareaRef, form, setForm, previewHtml }: EmailBodyEditorProps) {
  return (
    <Card className="border-slate-200/80 shadow-sm overflow-hidden bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-3 flex-row items-center justify-between border-b">
        <div>
          <CardTitle className="text-xl">Email Body</CardTitle>
          <CardDescription>
            Write HTML-friendly content • Use {"{{variable}}"} for personalization
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-44 grid-cols-2 mb-6">
            <TabsTrigger value="edit" className="gap-1.5">
              <Code className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-1.5">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="mt-0 focus-visible:outline-none">
            <Textarea
              ref={textareaRef as RefObject<HTMLTextAreaElement>}
              placeholder={`Start writing your email...

Dear {{candidateName}},

We are excited to invite you to an interview for the {{jobTitle}} position at {{companyName}}...`}
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              className="min-h-[60vh] lg:min-h-[65vh] font-mono text-base leading-relaxed resize-y border rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-500 bg-slate-50/40 p-4"
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <div
              className={cn(
                "min-h-[60vh] lg:min-h-[65vh] p-8 bg-white rounded-lg border shadow-inner prose prose-slate prose-headings:font-semibold prose-a:text-indigo-600 max-w-none overflow-auto"
              )}
              dangerouslySetInnerHTML={{ 
                __html: previewHtml() || "<p class='text-slate-400 italic text-center py-20'>Preview appears here...</p>" 
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="px-6 py-3 bg-slate-50/70 border-t flex justify-between items-center text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Variables are replaced automatically when sending</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {form.body?.length || 0} characters
        </Badge>
      </CardFooter>
    </Card>
  );
}