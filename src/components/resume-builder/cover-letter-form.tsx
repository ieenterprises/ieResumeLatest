import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  generateCoverLetterIntroduction,
  generateCoverLetterBody,
  generateCoverLetterConclusion,
} from "@/lib/gemini-ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Wand2 } from "lucide-react";

interface CoverLetterFormProps {
  setCoverLetterData: (data: any) => void;
}

export function CoverLetterForm({ setCoverLetterData }: CoverLetterFormProps) {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [jobDetails, setJobDetails] = useState({
    company: "",
    position: "",
    hiringManager: "",
    companyAddress: "",
  });

  const [letterContent, setLetterContent] = useState({
    greeting: "Dear Hiring Manager,",
    introduction: "",
    body: "",
    conclusion: "",
    signature: "Sincerely,",
  });

  const [template, setTemplate] = useState("professional");

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
    updateCoverLetterData(
      { ...personalInfo, [name]: value },
      jobDetails,
      letterContent,
      template,
    );
  };

  const handleJobDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
    updateCoverLetterData(
      personalInfo,
      { ...jobDetails, [name]: value },
      letterContent,
      template,
    );
  };

  const handleLetterContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setLetterContent((prev) => ({ ...prev, [name]: value }));
    updateCoverLetterData(
      personalInfo,
      jobDetails,
      { ...letterContent, [name]: value },
      template,
    );
  };

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    updateCoverLetterData(personalInfo, jobDetails, letterContent, value);
  };

  const updateCoverLetterData = (
    personalInfo: any,
    jobDetails: any,
    letterContent: any,
    template: string,
  ) => {
    setCoverLetterData({
      personalInfo,
      jobDetails,
      letterContent,
      template,
    });
  };

  const generateAIContent = () => {
    // This would connect to an AI service in a real implementation
    alert("AI content generation would be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cover Letter Builder</h2>

        <div className="space-y-2">
          <Label htmlFor="template">Select Template</Label>
          <Select value={template} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Accordion type="single" collapsible defaultValue="personal-info">
        <AccordionItem value="personal-info">
          <AccordionTrigger>Personal Information</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={personalInfo.address}
                    onChange={handlePersonalInfoChange}
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="job-details">
          <AccordionTrigger>Job Details</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    name="company"
                    value={jobDetails.company}
                    onChange={handleJobDetailsChange}
                    placeholder="Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    value={jobDetails.position}
                    onChange={handleJobDetailsChange}
                    placeholder="Job Title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hiringManager">
                    Hiring Manager (Optional)
                  </Label>
                  <Input
                    id="hiringManager"
                    name="hiringManager"
                    value={jobDetails.hiringManager}
                    onChange={handleJobDetailsChange}
                    placeholder="Hiring Manager's Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">
                    Company Address (Optional)
                  </Label>
                  <Input
                    id="companyAddress"
                    name="companyAddress"
                    value={jobDetails.companyAddress}
                    onChange={handleJobDetailsChange}
                    placeholder="Company Address"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="letter-content">
          <AccordionTrigger>Letter Content</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="greeting">Greeting</Label>
                  <Input
                    id="greeting"
                    name="greeting"
                    value={letterContent.greeting}
                    onChange={handleLetterContentChange}
                    placeholder="Dear Hiring Manager,"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="introduction">Introduction</Label>
                  <RichTextEditor
                    value={letterContent.introduction}
                    onChange={(value) => {
                      setLetterContent((prev) => ({
                        ...prev,
                        introduction: value,
                      }));
                      updateCoverLetterData(
                        personalInfo,
                        jobDetails,
                        { ...letterContent, introduction: value },
                        template,
                      );
                    }}
                    placeholder="I am writing to express my interest in the [Position] role at [Company]."
                    rows={3}
                    onAiSuggestion={async () => {
                      try {
                        const position = jobDetails.position || "[Position]";
                        const company = jobDetails.company || "[Company]";
                        const experience =
                          "5+ years of relevant experience in the field";

                        const aiContent = await generateCoverLetterIntroduction(
                          position,
                          company,
                          experience,
                        );

                        setLetterContent((prev) => ({
                          ...prev,
                          introduction: aiContent,
                        }));
                        updateCoverLetterData(
                          personalInfo,
                          jobDetails,
                          { ...letterContent, introduction: aiContent },
                          template,
                        );
                      } catch (error) {
                        console.error("Error generating AI content:", error);
                        alert(
                          "Failed to generate AI content. Please try again.",
                        );
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Body</Label>
                  <RichTextEditor
                    value={letterContent.body}
                    onChange={(value) => {
                      setLetterContent((prev) => ({ ...prev, body: value }));
                      updateCoverLetterData(
                        personalInfo,
                        jobDetails,
                        { ...letterContent, body: value },
                        template,
                      );
                    }}
                    placeholder="Describe your relevant experience and why you're a good fit for the position."
                    rows={6}
                    onAiSuggestion={async () => {
                      try {
                        const position = jobDetails.position || "[Position]";
                        const skills =
                          "communication, teamwork, problem-solving, leadership";
                        const achievements =
                          "increased team productivity by 20%, successfully completed projects under budget";

                        const aiContent = await generateCoverLetterBody(
                          position,
                          skills,
                          achievements,
                        );

                        setLetterContent((prev) => ({
                          ...prev,
                          body: aiContent,
                        }));
                        updateCoverLetterData(
                          personalInfo,
                          jobDetails,
                          { ...letterContent, body: aiContent },
                          template,
                        );
                      } catch (error) {
                        console.error("Error generating AI content:", error);
                        alert(
                          "Failed to generate AI content. Please try again.",
                        );
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conclusion">Conclusion</Label>
                  <RichTextEditor
                    value={letterContent.conclusion}
                    onChange={(value) => {
                      setLetterContent((prev) => ({
                        ...prev,
                        conclusion: value,
                      }));
                      updateCoverLetterData(
                        personalInfo,
                        jobDetails,
                        { ...letterContent, conclusion: value },
                        template,
                      );
                    }}
                    placeholder="Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team."
                    rows={3}
                    onAiSuggestion={async () => {
                      try {
                        const position = jobDetails.position || "[Position]";
                        const company = jobDetails.company || "[Company]";

                        const aiContent = await generateCoverLetterConclusion(
                          company,
                          position,
                        );

                        setLetterContent((prev) => ({
                          ...prev,
                          conclusion: aiContent,
                        }));
                        updateCoverLetterData(
                          personalInfo,
                          jobDetails,
                          { ...letterContent, conclusion: aiContent },
                          template,
                        );
                      } catch (error) {
                        console.error("Error generating AI content:", error);
                        alert(
                          "Failed to generate AI content. Please try again.",
                        );
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signature">Signature</Label>
                  <Input
                    id="signature"
                    name="signature"
                    value={letterContent.signature}
                    onChange={handleLetterContentChange}
                    placeholder="Sincerely,"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
