import { CoverLetterPreview } from "../cover-letter-preview";

export default function CoverLetterPreviewStoryboard() {
  const sampleCoverLetterData = {
    personalInfo: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(123) 456-7890",
      address: "123 Main St, Anytown, USA",
    },
    jobDetails: {
      company: "Acme Corporation",
      position: "Software Engineer",
      hiringManager: "Jane Smith",
      companyAddress: "456 Business Ave, Enterprise City, USA",
    },
    letterContent: {
      greeting: "Dear Ms. Smith,",
      introduction:
        "I am writing to express my interest in the Software Engineer position at Acme Corporation. With over 5 years of experience in web development, I am excited about the opportunity to join your innovative team.",
      body: "Throughout my career, I have developed expertise in React, TypeScript, and Node.js, which align perfectly with the requirements listed in your job posting. In my current role at Tech Solutions Inc., I successfully led the development of a customer portal that improved user engagement by 45% and reduced support tickets by 30%.",
      conclusion:
        "Thank you for considering my application. I am eager to discuss how my skills and experience can contribute to Acme Corporation's continued success. I look forward to the opportunity to speak with you further about this position.",
      signature: "Sincerely,",
    },
    template: "professional",
  };

  return (
    <div className="p-6 bg-background">
      <CoverLetterPreview coverLetterData={sampleCoverLetterData} />
    </div>
  );
}
