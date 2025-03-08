import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRef } from "react";
import { generatePDF } from "@/lib/html-to-pdf";

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

  const coverLetterRef = useRef<HTMLDivElement>(null);

  const downloadCoverLetter = async () => {
    if (coverLetterRef.current) {
      try {
        // Add a class to ensure proper styling during PDF generation
        coverLetterRef.current.classList.add("pdf-generation");

        const fileName = `${personalInfo.name || "cover-letter"}_${jobDetails.company || "company"}.pdf`;
        await generatePDF(coverLetterRef.current, fileName, {
          margin: 0.5,
          pageSize: 'letter',
          orientation: 'portrait',
          imageQuality: 1.0
        });

        // Remove the class after PDF generation
        coverLetterRef.current.classList.remove("pdf-generation");
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("There was an error generating your PDF. Please try again.");
      }
    }
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

      <div
        ref={coverLetterRef}
        className={`p-6 border rounded-md ${getTemplateStyles(template)}`}
        style={{ maxWidth: "100%", margin: "0 auto", breakInside: "avoid" }}
      >
        {/* Header / Personal Info */}
        <div className="mb-5">
          <div className="text-right mb-5">
            <p className="font-bold text-sm">
              {personalInfo.name || "Your Name"}
            </p>
            <p className="text-xs">{personalInfo.address || "Your Address"}</p>
            <p className="text-xs">
              {personalInfo.email || "your.email@example.com"}
            </p>
            <p className="text-xs">{personalInfo.phone || "(123) 456-7890"}</p>
            <p className="text-xs">{today}</p>
          </div>

          {jobDetails.hiringManager || jobDetails.company ? (
            <div className="mb-5">
              {jobDetails.hiringManager && (
                <p className="text-xs">{jobDetails.hiringManager}</p>
              )}
              {jobDetails.company && (
                <p className="text-xs">{jobDetails.company}</p>
              )}
              {jobDetails.companyAddress && (
                <p className="text-xs">{jobDetails.companyAddress}</p>
              )}
            </div>
          ) : (
            <div className="mb-5">
              <p className="text-xs">Hiring Manager</p>
              <p className="text-xs">Company Name</p>
              <p className="text-xs">Company Address</p>
            </div>
          )}
        </div>

        {/* Letter Content */}
        <div className="space-y-3">
          <p className="text-xs">
            {letterContent.greeting || "Dear Hiring Manager,"}
          </p>

          <p className="text-xs leading-normal">
            {letterContent.introduction ||
              `I am writing to express my interest in the ${jobDetails.position || "[Position]"} role at ${jobDetails.company || "[Company]"}. I was excited to see this opportunity as my skills and experience align well with the requirements of this position.`}
          </p>

          <p className="text-xs leading-normal">
            {letterContent.body ||
              "With my background in [relevant field] and experience in [relevant skills], I am confident that I can make valuable contributions to your team. In my previous role at [Previous Company], I successfully [achievement or responsibility relevant to the job]."}
          </p>

          <p className="text-xs leading-normal">
            {letterContent.conclusion ||
              "Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team and would welcome the chance to elaborate on my qualifications in an interview."}
          </p>

          <div className="mt-4">
            <p className="text-xs">{letterContent.signature || "Sincerely,"}</p>
            <p className="mt-3 text-sm font-medium">
              {personalInfo.name || "Your Name"}
            </p>
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
