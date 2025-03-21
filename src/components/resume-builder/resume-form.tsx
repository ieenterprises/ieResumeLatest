import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SimpleEditor } from "@/components/ui/simple-editor";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { DatePicker } from "@/components/ui/date-picker";
import {
  generateResumeSummary,
  generateJobDescription,
  generateCustomSectionContent,
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
import { PlusCircle, Trash2, Wand2, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ResumeFormProps {
  setResumeData: (data: any) => void;
}

interface CustomSection {
  title: string;
  content: string;
}

export function ResumeForm({ setResumeData }: ResumeFormProps) {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    title: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    photo: "",
  });

  const [experiences, setExperiences] = useState([
    { company: "", position: "", startDate: "", endDate: "", description: "" },
  ]);

  const [education, setEducation] = useState([
    { institution: "", degree: "", field: "", graduationDate: "", gpa: "" },
  ]);

  const [skills, setSkills] = useState([""]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [template, setTemplate] = useState("professional");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
    updateResumeData(
      { ...personalInfo, [name]: value },
      experiences,
      education,
      skills,
      customSections,
      template,
    );
  };

  const handleExperienceChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    setExperiences(updatedExperiences);
    updateResumeData(
      personalInfo,
      updatedExperiences,
      education,
      skills,
      customSections,
      template,
    );
  };

  const handleEducationChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setEducation(updatedEducation);
    updateResumeData(
      personalInfo,
      experiences,
      updatedEducation,
      skills,
      customSections,
      template,
    );
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
    updateResumeData(
      personalInfo,
      experiences,
      education,
      updatedSkills,
      customSections,
      template,
    );
  };

  const handleCustomSectionChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedCustomSections = [...customSections];
    updatedCustomSections[index] = {
      ...updatedCustomSections[index],
      [field]: value,
    };
    setCustomSections(updatedCustomSections);
    updateResumeData(
      personalInfo,
      experiences,
      education,
      skills,
      updatedCustomSections,
      template,
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        setPersonalInfo((prev) => ({ ...prev, photo: photoUrl }));
        updateResumeData(
          { ...personalInfo, photo: photoUrl },
          experiences,
          education,
          skills,
          customSections,
          template,
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setPersonalInfo((prev) => ({ ...prev, photo: "" }));
    updateResumeData(
      { ...personalInfo, photo: "" },
      experiences,
      education,
      skills,
      customSections,
      template,
    );
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      const updatedExperiences = experiences.filter((_, i) => i !== index);
      setExperiences(updatedExperiences);
      updateResumeData(
        personalInfo,
        updatedExperiences,
        education,
        skills,
        customSections,
        template,
      );
    }
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { institution: "", degree: "", field: "", graduationDate: "", gpa: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      const updatedEducation = education.filter((_, i) => i !== index);
      setEducation(updatedEducation);
      updateResumeData(
        personalInfo,
        experiences,
        updatedEducation,
        skills,
        customSections,
        template,
      );
    }
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index: number) => {
    if (skills.length > 1) {
      const updatedSkills = skills.filter((_, i) => i !== index);
      setSkills(updatedSkills);
      updateResumeData(
        personalInfo,
        experiences,
        education,
        updatedSkills,
        customSections,
        template,
      );
    }
  };

  const addCustomSection = () => {
    setCustomSections([...customSections, { title: "", content: "" }]);
  };

  const removeCustomSection = (index: number) => {
    const updatedCustomSections = customSections.filter((_, i) => i !== index);
    setCustomSections(updatedCustomSections);
    updateResumeData(
      personalInfo,
      experiences,
      education,
      skills,
      updatedCustomSections,
      template,
    );
  };

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    updateResumeData(
      personalInfo,
      experiences,
      education,
      skills,
      customSections,
      value,
    );
  };

  const updateResumeData = (
    personalInfo: any,
    experiences: any[],
    education: any[],
    skills: string[],
    customSections: CustomSection[],
    template: string,
  ) => {
    setResumeData({
      personalInfo,
      experiences,
      education,
      skills,
      customSections,
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
        <h2 className="text-xl font-semibold">Resume Builder</h2>

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
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-2 border-gray-200">
                    <AvatarImage src={personalInfo.photo} alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {personalInfo.name
                        ? personalInfo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex gap-2 mt-2 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={triggerFileInput}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                    {personalInfo.photo && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removePhoto}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

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
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={personalInfo.title || ""}
                    onChange={handlePersonalInfoChange}
                    placeholder="Software Engineer"
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

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <DatePicker
                    value={
                      personalInfo.dob ? new Date(personalInfo.dob) : undefined
                    }
                    onChange={(date) => {
                      setPersonalInfo((prev) => ({
                        ...prev,
                        dob: date ? date.toISOString() : "",
                      }));
                      updateResumeData(
                        {
                          ...personalInfo,
                          dob: date ? date.toISOString() : "",
                        },
                        experiences,
                        education,
                        skills,
                        customSections,
                        template,
                      );
                    }}
                    placeholder="Select date of birth"
                    allowYearMonthOnly={true}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const experience =
                            personalInfo.title || "professional";
                          const skillsList =
                            skills.filter((s) => s.trim()).join(", ") ||
                            "various skills";
                          // Add loading state
                          setPersonalInfo((prev) => ({
                            ...prev,
                            summary: "Generating AI content...",
                          }));
                          const aiContent = await generateResumeSummary(
                            experience,
                            skillsList,
                          );
                          setPersonalInfo((prev) => ({
                            ...prev,
                            summary: aiContent,
                          }));
                          updateResumeData(
                            { ...personalInfo, summary: aiContent },
                            experiences,
                            education,
                            skills,
                            customSections,
                            template,
                          );
                        } catch (error) {
                          console.error("Error generating AI content:", error);
                          alert(
                            "Failed to generate AI content. Please try again.",
                          );
                        }
                      }}
                    >
                      <Wand2 className="h-4 w-4 mr-1" />
                      Generate with AI
                    </Button>
                  </div>
                  <SimpleEditor
                    value={personalInfo.summary}
                    onChange={(value) => {
                      setPersonalInfo((prev) => ({ ...prev, summary: value }));
                      updateResumeData(
                        { ...personalInfo, summary: value },
                        experiences,
                        education,
                        skills,
                        customSections,
                        template,
                      );
                    }}
                    placeholder="Brief overview of your professional background and goals"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger>Work Experience</AccordionTrigger>
          <AccordionContent>
            {experiences.map((exp, index) => (
              <div key={index} className="p-4 border rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Experience {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    disabled={experiences.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "company",
                            e.target.value,
                          )
                        }
                        placeholder="Company Name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "position",
                            e.target.value,
                          )
                        }
                        placeholder="Job Title"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <DatePicker
                          value={
                            exp.startDate ? new Date(exp.startDate) : undefined
                          }
                          onChange={(date) =>
                            handleExperienceChange(
                              index,
                              "startDate",
                              date ? date.toISOString() : "",
                            )
                          }
                          placeholder="Select start date"
                          allowYearMonthOnly={true}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`present-${index}`}
                              checked={exp.endDate === "present"}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleExperienceChange(
                                    index,
                                    "endDate",
                                    "present",
                                  );
                                } else {
                                  handleExperienceChange(index, "endDate", "");
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                              htmlFor={`present-${index}`}
                              className="text-sm font-medium text-gray-700"
                            >
                              Present / Current
                            </label>
                          </div>
                          {exp.endDate !== "present" && (
                            <DatePicker
                              value={
                                exp.endDate ? new Date(exp.endDate) : undefined
                              }
                              onChange={(date) =>
                                handleExperienceChange(
                                  index,
                                  "endDate",
                                  date ? date.toISOString() : "",
                                )
                              }
                              placeholder="Select end date"
                              allowYearMonthOnly={true}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Description</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              const position = exp.position || "position";
                              const company = exp.company || "company";
                              const responsibilities =
                                "responsibilities and achievements in this role";
                              // Add loading state
                              handleExperienceChange(
                                index,
                                "description",
                                "Generating AI content...",
                              );
                              const aiContent = await generateJobDescription(
                                position,
                                company,
                                responsibilities,
                              );
                              handleExperienceChange(
                                index,
                                "description",
                                aiContent,
                              );
                            } catch (error) {
                              console.error(
                                "Error generating AI content:",
                                error,
                              );
                              alert(
                                "Failed to generate AI content. Please try again.",
                              );
                            }
                          }}
                        >
                          <Wand2 className="h-4 w-4 mr-1" />
                          Generate with AI
                        </Button>
                      </div>
                      <SimpleEditor
                        value={exp.description}
                        onChange={(value) =>
                          handleExperienceChange(index, "description", value)
                        }
                        placeholder="Describe your responsibilities and achievements"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              onClick={addExperience}
              variant="outline"
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger>Education</AccordionTrigger>
          <AccordionContent>
            {education.map((edu, index) => (
              <div key={index} className="p-4 border rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Education {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    disabled={education.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "institution",
                            e.target.value,
                          )
                        }
                        placeholder="University/College Name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "degree",
                              e.target.value,
                            )
                          }
                          placeholder="Bachelor's, Master's, etc."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "field",
                              e.target.value,
                            )
                          }
                          placeholder="Computer Science, Business, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Graduation Date</Label>
                        <DatePicker
                          value={
                            edu.graduationDate
                              ? new Date(edu.graduationDate)
                              : undefined
                          }
                          onChange={(date) =>
                            handleEducationChange(
                              index,
                              "graduationDate",
                              date ? date.toISOString() : "",
                            )
                          }
                          placeholder="Select graduation date"
                          allowYearMonthOnly={true}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>GPA (Optional)</Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) =>
                            handleEducationChange(index, "gpa", e.target.value)
                          }
                          placeholder="3.8/4.0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={addEducation} variant="outline" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger>Skills</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    placeholder="e.g., Project Management, JavaScript, Photoshop"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill(index)}
                    disabled={skills.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button onClick={addSkill} variant="outline" className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="custom-sections">
          <AccordionTrigger>Custom Sections</AccordionTrigger>
          <AccordionContent>
            {customSections.map((section, index) => (
              <div key={index} className="p-4 border rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Custom Section {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomSection(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Section Title</Label>
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          handleCustomSectionChange(
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Certifications, Projects, Publications"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Content</Label>
                      <SimpleEditor
                        value={section.content}
                        onChange={(value) =>
                          handleCustomSectionChange(index, "content", value)
                        }
                        placeholder="Add the content for this section"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              onClick={addCustomSection}
              variant="outline"
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Custom Section
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
