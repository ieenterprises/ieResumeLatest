import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeForm } from "./resume-form";
import { CoverLetterForm } from "./cover-letter-form";
import { ResumePreview } from "./resume-preview";
import { CoverLetterPreview } from "./cover-letter-preview";
import { useState } from "react";

export type DocumentType = "resume" | "coverLetter";

export function ResumeBuilderLayout() {
  const [documentType, setDocumentType] = useState<DocumentType>("resume");
  const [resumeData, setResumeData] = useState({});
  const [coverLetterData, setCoverLetterData] = useState({});

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b bg-white py-4">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-700">Resume Builder</h1>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <Tabs
          defaultValue="resume"
          className="w-full"
          onValueChange={(value) => setDocumentType(value as DocumentType)}
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="coverLetter">Cover Letter</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
              <TabsContent value="resume" className="mt-0">
                <ResumeForm setResumeData={setResumeData} />
              </TabsContent>
              <TabsContent value="coverLetter" className="mt-0">
                <CoverLetterForm setCoverLetterData={setCoverLetterData} />
              </TabsContent>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              {documentType === "resume" ? (
                <ResumePreview resumeData={resumeData} />
              ) : (
                <CoverLetterPreview coverLetterData={coverLetterData} />
              )}
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
