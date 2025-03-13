import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateResumeSummary } from "@/lib/gemini-ai";

export default function AIResumeDemo() {
  const [title, setTitle] = useState("Software Engineer");
  const [skills, setSkills] = useState(
    "React, TypeScript, Node.js, API development",
  );
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    try {
      setIsGenerating(true);
      const experience = `${title} with experience in ${skills}`;
      const aiContent = await generateResumeSummary(experience, skills);
      setSummary(aiContent);
    } catch (error) {
      console.error("Error generating AI content:", error);
      alert("Failed to generate AI content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        AI Resume Summary Generator Demo
      </h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Software Engineer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Input
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g., React, TypeScript, Node.js"
          />
        </div>

        <Button
          onClick={generateSummary}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? "Generating..." : "Generate Professional Summary"}
        </Button>

        <div className="space-y-2">
          <Label htmlFor="summary">Generated Summary</Label>
          <div className="p-4 border rounded-md bg-gray-50 min-h-[150px]">
            {summary ? (
              <div dangerouslySetInnerHTML={{ __html: summary }}></div>
            ) : (
              <p className="text-gray-400">
                Your AI-generated summary will appear here
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
