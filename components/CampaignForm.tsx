"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { requestNotificationPermission } from "../firebase/firebase";
import { storeCampaignToken, Campaign, storeDeviceFCM } from "../firebase/campaign";

const steps = [
  {
    label: "Enter campaign details",
    description:
      "Provide the campaign name, notification title, and body to proceed.",
  },
  {
    label: "Target",
    description:
      "Select your target audience and choose the advertising channels where you would like to show your ads.",
  },
  {
    label: "scheduling",
    description:
      "Choose the start and end dates for your campaign, and set the daily budget.",
  },
];

export default function CampaignForm() {
  const [campaignName, setCampaignName] = useState("");
  const [title, setTitle] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [body, setBody] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [img, setImg] = useState("");
  const isDisabled = activeStep === 0 && (!campaignName || !title || !body);
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
      const token = await requestNotificationPermission();
      if (!token) {
        alert("Notification permission denied. Please enable it in your browser settings.");
        return;
      }

      // Store the campaign in Firestore
      const campaignId = Date.now().toString();
      const newCampaign: Campaign = {
        id: campaignId,
        name: campaignName,
        title: title,
        text: body,
        image: img,
      };
      await storeCampaignToken(newCampaign);
      await storeDeviceFCM(token);

      const delay = selectedDateTime.getTime() - now.getTime();

      // Delay the notification sending
      setTimeout(async () => {
        try {
          const response = await fetch("/api/send-notification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              title,
              body,
              image: img,
              campaignId, // ✅ Sending campaignId
            }),
          });

          if (!response.ok) throw new Error("Failed to send notification");

          const data = await response.json();
          console.log("Notification Response:", data);

          if (data.success) {
            new Notification(title, { body });
          } else {
            alert("Failed to send notification. Please try again.");
          }
        } catch (error) {
          console.error("Error sending notification:", error);
          alert("Failed to send notification. Please try again.");
        }
      }, delay);
    } catch (error) {
      console.error("Error handling campaign submission:", error);
      alert("An error occurred while scheduling the campaign.");
    }
  };

  useEffect(() => {
   
  }, []);

 
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-md shadow-md">
      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left column: form fields and sticky navigation buttons */}
        <div className="flex-1 relative">
          {/* Form fields */}
          {activeStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input
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
                <Input
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
                <Input
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter notification body"
                  required
                  className="!h-10 !w-full !rounded-xl !border !border-gray-300 !bg-white !px-3 !py-2 !text-sm !placeholder-gray-400 !focus:outline-none !focus:ring-black"
                />
              </div>
              <div>
                <Label htmlFor="img">Notification Image URL</Label>
                <Input
                  id="img"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  placeholder="Enter image URL"
                  className="!h-10 !w-full !rounded-xl !border !border-gray-300 !bg-white !px-3 !py-2 !text-sm !placeholder-gray-400 !focus:outline-none !focus:ring-black"
                />
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-4">
              <p>
                This is the target selection step. Implement target audience
                inputs or options here as needed.
              </p>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={
                    scheduledDate || new Date().toISOString().split("T")[0]
                  }
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

          {/* Sticky Navigation Buttons - arranged in a column */}
          <div className="sticky bottom-0 bg-white py-4">
            <div className="flex flex-col space-y-4">
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
        </div>

        {/* Right column: Phone preview */}
        {/* Phone container */}
<div className="relative w-[300px] h-[600px] bg-white border-2 border-gray-300 rounded-[2rem] shadow-lg overflow-hidden">
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
      <img
        src="https://via.placeholder.com/40x40.png?text=App"
        alt="App Icon"
        className="w-8 h-8 rounded-md"
      />
      <div className="flex-1 flex flex-col space-y-1">
        <div className="text-xs text-gray-600 font-medium">
          MIRAAYA • now
        </div>
        <div className="text-sm font-semibold">
          {title || "Your visitors are waiting for you!"}
        </div>
        <div className="text-xs text-gray-600">
          {body ||
            "Send timely, precise and relevant push notifications to your users for more and better engagement."}
        </div>
      </div>
      {/* User-provided image on the right */}
      {img && (
        <img
          src={img}
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
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700")
                }
              >
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}