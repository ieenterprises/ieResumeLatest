import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CoverLetterPreviewProps {
  coverLetterData: any;
}

export function CoverLetterPreview({
  coverLetterData,
}: CoverLetterPreviewProps) {
  const {
    personalInfo = {},
    jobDetails = {},
    letterContent = {},
    template = "professional",
  } = coverLetterData;

  const downloadCoverLetter = () => {
    // Simplified approach - just show a message for now
    alert(
      "PDF generation will be implemented in a future update. This would download the cover letter as a PDF.",
    );

    // In a production app, we would use html2canvas and jsPDF here
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button onClick={downloadCoverLetter} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className={`p-6 border rounded-md ${getTemplateStyles(template)}`}>
        {/* Header / Personal Info */}
        <div className="mb-6">
          <div className="text-right mb-6">
            <p className="font-bold">{personalInfo.name || "Your Name"}</p>
            <p>{personalInfo.address || "Your Address"}</p>
            <p>{personalInfo.email || "your.email@example.com"}</p>
            <p>{personalInfo.phone || "(123) 456-7890"}</p>
            <p>{today}</p>
          </div>

          {jobDetails.hiringManager || jobDetails.company ? (
            <div className="mb-6">
              {jobDetails.hiringManager && <p>{jobDetails.hiringManager}</p>}
              {jobDetails.company && <p>{jobDetails.company}</p>}
              {jobDetails.companyAddress && <p>{jobDetails.companyAddress}</p>}
            </div>
          ) : (
            <div className="mb-6">
              <p>Hiring Manager</p>
              <p>Company Name</p>
              <p>Company Address</p>
            </div>
          )}
        </div>

        {/* Letter Content */}
        <div className="space-y-4">
          <p>{letterContent.greeting || "Dear Hiring Manager,"}</p>

          <p>
            {letterContent.introduction ||
              `I am writing to express my interest in the ${jobDetails.position || "[Position]"} role at ${jobDetails.company || "[Company]"}. I was excited to see this opportunity as my skills and experience align well with the requirements of this position.`}
          </p>

          <p>
            {letterContent.body ||
              "With my background in [relevant field] and experience in [relevant skills], I am confident that I can make valuable contributions to your team. In my previous role at [Previous Company], I successfully [achievement or responsibility relevant to the job]."}
          </p>

          <p>
            {letterContent.conclusion ||
              "Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team and would welcome the chance to elaborate on my qualifications in an interview."}
          </p>

          <div className="mt-6">
            <p>{letterContent.signature || "Sincerely,"}</p>
            <p className="mt-4">{personalInfo.name || "Your Name"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTemplateStyles(template: string): string {
  switch (template) {
    case "modern":
      return "bg-gray-50 font-sans";
    case "creative":
      return "bg-purple-50 font-serif";
    case "simple":
      return "bg-white font-mono";
    case "professional":
    default:
      return "bg-white font-sans";
  }
}
