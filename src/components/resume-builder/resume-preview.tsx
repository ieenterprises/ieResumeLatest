import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRef } from "react";
import { generatePDF } from "@/lib/pdf-generator";

interface ResumePreviewProps {
  resumeData: any;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const {
    personalInfo = {},
    experiences = [],
    education = [],
    skills = [],
    customSections = [],
    template = "professional",
  } = resumeData;

  const resumeRef = useRef<HTMLDivElement>(null);

  const downloadResume = async () => {
    if (resumeRef.current) {
      try {
        const fileName = `${personalInfo.name || "resume"}.pdf`;
        await generatePDF(resumeRef.current, fileName);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("There was an error generating your PDF. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button onClick={downloadResume} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div
        ref={resumeRef}
        className={`p-6 border rounded-md ${getTemplateStyles(template)}`}
      >
        {/* Header / Personal Info */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {personalInfo.name || "Your Name"}
          </h1>
          <div className="text-sm space-y-1">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.address && <p>{personalInfo.address}</p>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-sm">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">
              Work Experience
            </h2>
            {experiences.map((exp: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{exp.position || "Position"}</h3>
                  <span className="text-sm">
                    {exp.startDate || "Start Date"} -{" "}
                    {exp.endDate || "End Date"}
                  </span>
                </div>
                <p className="text-sm font-medium">
                  {exp.company || "Company"}
                </p>
                <p className="text-sm mt-1">
                  {exp.description || "Job description"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">
              Education
            </h2>
            {education.map((edu: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">
                    {edu.institution || "Institution"}
                  </h3>
                  <span className="text-sm">
                    {edu.graduationDate || "Graduation Date"}
                  </span>
                </div>
                <p className="text-sm">
                  {edu.degree || "Degree"}
                  {edu.field ? `, ${edu.field}` : ""}
                  {edu.gpa ? ` - GPA: ${edu.gpa}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && skills[0] !== "" && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="text-sm bg-gray-100 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {customSections.length > 0 &&
          customSections.map((section: any, index: number) =>
            section.title && section.content ? (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">
                  {section.title}
                </h2>
                <p className="text-sm whitespace-pre-line">{section.content}</p>
              </div>
            ) : null,
          )}
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
