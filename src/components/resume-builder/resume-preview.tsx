import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRef } from "react";
import { generatePDF } from "@/lib/pdf-generator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        className={`p-6 ${getTemplateStyles(template)}`}
        style={{ maxWidth: "100%", margin: "0 auto", lineHeight: "1.6" }}
      >
        {/* Header / Personal Info */}
        <div className="mb-5" style={{ breakInside: "avoid" }}>
          <div className="flex items-center gap-4">
            {personalInfo.photo && (
              <Avatar className="w-16 h-16 border">
                <AvatarImage src={personalInfo.photo} alt="Profile" />
                <AvatarFallback className="text-base">
                  {personalInfo.name
                    ? personalInfo.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={personalInfo.photo ? "flex-1" : "text-center w-full"}
            >
              <h1 className="text-xl font-bold mb-1">
                {personalInfo.name || "Your Name"}
              </h1>
              {personalInfo.title && (
                <p className="text-sm mb-1">{personalInfo.title}</p>
              )}
              <div className="text-xs space-y-0.5">
                {personalInfo.email && <p>{personalInfo.email}</p>}
                {personalInfo.phone && <p>{personalInfo.phone}</p>}
                {personalInfo.address && <p>{personalInfo.address}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Summary and Work Experience kept together */}
        <div className="keep-together">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <div className="mb-4">
              <h2 className="text-base font-semibold border-b pb-1 mb-1">
                Professional Summary
              </h2>
              <p
                className="text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
              ></p>
            </div>
          )}

          {/* Experience section */}
          <div className="mb-4">
            <h2 className="text-base font-semibold border-b pb-1 mb-1">
              Work Experience
            </h2>
            {experiences.length > 0 ? (
              experiences.map((exp: any, index: number) => (
                <div
                  key={index}
                  className="mb-3"
                  style={{ breakInside: "avoid" }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium">
                      {exp.position || "Position"}
                    </h3>
                    <span className="text-xs">
                      {exp.startDate || "Start Date"} -{" "}
                      {exp.endDate || "End Date"}
                    </span>
                  </div>
                  <p className="text-xs font-medium">
                    {exp.company || "Company"}
                  </p>
                  <p
                    className="text-xs mt-0.5 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: exp.description || "Job description",
                    }}
                  ></p>
                </div>
              ))
            ) : (
              <p className="text-xs italic">No work experience added</p>
            )}
          </div>
        </div>

        {/* Education - Ensure this section stays together */}
        <div className="mb-4 keep-together">
          <h2 className="text-base font-semibold border-b pb-1 mb-1">
            Education
          </h2>
          {education.length > 0 ? (
            education.map((edu: any, index: number) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium">
                    {edu.institution || "Institution"}
                  </h3>
                  <span className="text-xs">
                    {edu.graduationDate || "Graduation Date"}
                  </span>
                </div>
                <p className="text-xs">
                  {edu.degree || "Degree"}
                  {edu.field ? `, ${edu.field}` : ""}
                  {edu.gpa ? ` - GPA: ${edu.gpa}` : ""}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs italic">No education added</p>
          )}
        </div>

        {/* Skills */}
        <div className="mb-4 keep-together">
          <h2 className="text-base font-semibold border-b pb-1 mb-1">Skills</h2>
          {skills.length > 0 && skills[0] !== "" ? (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs italic">No skills added</p>
          )}
        </div>

        {/* Custom Sections - Ensure these stay together */}
        {customSections.length > 0 &&
          customSections.map((section: any, index: number) =>
            section.title && section.content ? (
              <div key={index} className="mb-4 keep-together">
                <h2 className="text-base font-semibold border-b pb-1 mb-1">
                  {section.title}
                </h2>
                <p
                  className="text-xs leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                ></p>
              </div>
            ) : null,
          )}

        {/* No fixed References section - it should be added as a custom section if needed */}
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
