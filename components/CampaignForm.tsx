"use client";
 
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeCampaignToken, Campaign } from "../firebase/campaign";
import { se } from '@/app/api/auth/signin';
const steps = [
  {
    label: "Notification",
    description:
      "Provide the campaign name, notification title, and body to proceed.",
  },
  {
    label: "Scheduling",
    description:
      "Choose when to send you notifications.",
  },
];
 
export default function CampaignForm() {
  const [campaignName, setCampaignName] = useState("");
  const [title, setTitle] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split("T")[0]);
  const [scheduledTime, setScheduledTime] = useState(
    new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
  );
  
  const [body, setBody] = useState("");
  const [activeStep, setActiveStep] = useState(0);
 
  const [imgUrlInput, setImgUrlInput] = useState(""); // URL provided by the user
 
 
  const isDisabled = activeStep === 0 && (!campaignName || !title || !body);
 
 
 
  // Determine the final image URL for submission and preview
  const getFinalImageUrl = (): string => {
    // If a file was selected, use the file preview (or uploaded URL if needed)
    // Here we use the file preview for immediate display; however, you could also swap it for the uploaded URL.
    return imgUrlInput || "";
  };
 
  const handleNext = async () => {
    // If on the final step, submit the form
    if (activeStep === steps.length - 1) {
      await handleSubmit();
    }
    // Validate the first step: require campaign name, title, and body
    else if (activeStep === 0 && (!campaignName || !title || !body)) {
      return;
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };
 
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
 
  const handleSubmit = async () => {
    if (!campaignName || !title || !body) {
      alert("Please fill in all required fields.");
      return;
    }
 
    const now = new Date();
    const selectedDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (selectedDateTime < now) {
      alert("Scheduled time cannot be in the past.");
      return;
    }
 
    try {
      // Request notification permission and get token
      const finalImgUrl = imgUrlInput || "";
      // Store the campaign in Firestore
      const campaignId = Date.now().toString();
      const newCampaign: Campaign = {
        id: campaignId,
        name: campaignName,
        title: title,
        text: body,
        image: finalImgUrl,
        send_at: selectedDateTime,
      };
      await storeCampaignToken(newCampaign);
      alert("Campaign scheduled successfully!");
      
    } catch (error) {
      console.error("Error handling campaign submission:", error);
      alert("An error occurred while scheduling the campaign.");
    }
  };
 
  useEffect(() => {
 
 
  }, []);
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.9)] font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Notification</h1>
      </div>
 
      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left column: Form fields and navigation buttons */}
        <div className="flex-1">
          {/* Step description */}
          <p className="mb-6 text-sm text-gray-600">
            {steps[activeStep].label === "Notification"
              ? "Provide the campaign name, notification title, and body to proceed."
              : steps[activeStep].label === "Target"
                ? "Select your target audience and choose where you'd like to show ads."
                : steps[activeStep].label === "Scheduling"
                  ? "Choose when to send your notifications."
                  : "Review your details before finalizing."}
          </p>
 
          {/* Step-specific form fields */}
          {activeStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name</Label>
                <input
                  id="campaignName"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
                  required
                  className="!h-10 !w-full !rounded-xl !border !border-gray-300 !bg-white !px-3 !py-2 !text-sm !placeholder-gray-400 !focus:outline-none !focus:ring-black"
                />
              </div>
              <div>
                <Label htmlFor="title">Notification Title</Label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title"
                  required
                  className="!h-10 !w-full !rounded-xl !border !border-gray-300 !bg-white !px-3 !py-2 !text-sm !placeholder-gray-400 !focus:outline-none !focus:ring-black"
                />
              </div>
              <div>
                <Label htmlFor="body">Notification Body</Label>
                <input
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter notification body"
                  required
                  className="!h-10 !w-full !rounded-xl !border !border-gray-300 !bg-white !px-3 !py-2 !text-sm !placeholder-gray-400 !focus:outline-none !focus:ring-black"
                />
              </div>
              <div>
 
              </div>
              <div>
                {/* Direct URL Input for Image */}
                <Label htmlFor="img">Notification Image URL (optional)</Label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imgUrlInput}
                  onChange={(e) => setImgUrlInput(e.target.value)}
                  className="!h-10 !w-full !rounded-xl !border !border-gray-300 !bg-white !px-3 !py-2 !text-sm !placeholder-gray-400 !focus:outline-none !focus:ring-black"
 
                />
              </div>
 
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={scheduledDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="!h-10 !w-full !rounded-xl !border !border-gray-300 !bg-white !px-3 !py-2 !text-sm !placeholder-gray-400 !focus:outline-none !focus:ring-black"
                />
              </div>
              <div>
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={
                    scheduledTime ||
                    new Date().toLocaleTimeString("it-IT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                  className="!h-10 !w-full !rounded-xl !border !border-gray-300 !bg-white !px-3 !py-2 !text-sm !placeholder-gray-400 !focus:outline-none !focus:ring-black"
                />
              </div>
            </div>
          )}
 
          {/* Fixed Navigation Buttons - side-by-side, below form fields */}
          <div className="sticky bottom-0 bg-white py-4">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={activeStep === 0}
                style={{
                  backgroundColor: activeStep === 0 ? "#808080" : "#1f1f1f",
                  color: "#ffffff",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: activeStep === 0 ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s ease-in-out",
                  outline: "none",
                }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={isDisabled}
                style={{
                  backgroundColor: isDisabled ? "#808080" : "#000000",
                  color: "#ffffff",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s ease-in-out",
                  outline: "none",
                }}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Continue"}
              </button>
            </div>
          </div>
 
          {/* Centered Pill-Style Stepper at the Bottom */}
          <div className="flex justify-center my-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const isActive = index === activeStep;
                return (
                  <div
                    key={step.label}
                    className={
                      "rounded-full px-8 py-1 text-sm font-medium transition-colors cursor-pointer " +
                      (isActive
                        ? "bg-black "
                        : "bg-gray-400")
                    }
                  >
                  </div>
                );
              })}
            </div>
          </div>
 
 
 
 
        </div>
 
        {/* Right column: Phone preview */}
        {/* Phone container */}
        <div className="relative w-[300px] h-[600px] bg-white border-2 border-gray-300 rounded-[2rem] shadow-lg overflow-hidden ml-10 mr-5 mt-[-60px]">
          {/* Status bar */}
          <div className="absolute top-0 w-full h-8 flex items-center justify-between px-4 text-xs bg-gray-100 text-gray-700">
            <div>9:30</div>
            <div className="flex space-x-1">
              <span className="w-3 h-3 bg-gray-400 rounded-sm inline-block" />
              <span className="w-3 h-3 bg-gray-400 rounded-sm inline-block" />
              <span className="w-4 h-3 bg-gray-400 rounded-sm inline-block" />
            </div>
          </div>
 
          {/* Camera hole */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full" />
 
          {/* Notification content area */}
          <div className="mt-10 p-4">
            {/* Single notification */}
            <div className="flex items-start space-x-2">
              {/* App icon */}
 
              <div className="flex-1 flex flex-col space-y-1">
                <div className="text-xs text-gray-600 font-medium">
                  MIRAAYA • now
                  <svg
                    className="w-3 h-3 inline-block ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
 
                  </svg>
                </div>
                <div className="text-sm font-semibold">
                  {title || "Notification title"}
                </div>
                <div className="text-xs text-gray-600">
                  {body ||
                    "Notification body text. This is a preview of how your notification will appear on the user's device."}
                </div>
                <hr></hr>
              </div>
              {/* User-provided image on the right */}
              {getFinalImageUrl() && (
                <img
                  src={getFinalImageUrl()}
                  alt="Notification Preview"
                  className="w-12 h-12 object-cover rounded-md self-start"
                />
              )}
            </div>
          </div>
 
          {/* Bottom bar */}
          <div className="absolute bottom-0 w-full h-6 flex items-center justify-center bg-white">
            <div className="w-20 h-1 bg-black/50 rounded-full" />
          </div>
        </div>
 
      </div>
 
    </div>
  );
}