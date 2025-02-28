'use client'
import React, { useState } from 'react';
import { storeCampaignToken, Campaign } from '../firebase/campaign';
import { requestNotificationPermission } from '../firebase/firebase';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

// Steps
const steps = [
  {
    label: 'Enter campaign details',
    description: 'Provide the campaign name, notification title, and body to proceed.',
  },
  {
    label: 'Target',
    description:
      'Select your target audience and choose the advertising channels where you would like to show your ads.',
  },
  {
    label: 'scheduling ',
    description:
      'Choose the start and end dates for your campaign, and set the daily budget.',
  },
];

export default function CampaignForm() {
  const [campaignName, setCampaignName] = useState('');
  const [title, setTitle] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [body, setBody] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await handleSubmit();
    } else if (activeStep === 0 && (!campaignName || !title || !body)) {
      return;
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = async () => {
    const now = new Date();
    const selectedDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (selectedDateTime < now) {
      alert('Scheduled time cannot be in the past.');
      return;
    }

    const delay = selectedDateTime.getTime() - now.getTime();
    setTimeout(async () => {
      try {
        const token = await requestNotificationPermission();
        if (!token) {
          alert('Notification permission denied. Please enable it in your browser settings.');
          return;
        }

        const newCampaign = {
          id: Date.now().toString(),
          name: campaignName,
        };
        await storeCampaignToken(newCampaign, token);

        const response = await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, title, body }),
        });

        console.log('Notification Response:', response);

        if (!response.ok) {
          throw new Error('Failed to send notification');
        }

        const data = await response.json();
        console.log('Notification Response:', data);
        alert('Notification Sent!');
      } catch (error) {
        console.error('Error sending notification:', error);
        alert('Failed to send notification. Please try again.');
      }
    }, delay);
  };

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100vh', boxShadow: 3, p: 3, borderRadius: 2, overflowY: 'auto' }}>
    <Stepper activeStep={activeStep} orientation="vertical" sx={{ width: '100%', mt: 0 }}>

        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent sx={{ mb: 2 }}> 
              <Typography>{step.description}</Typography>
              {index === 0 && (
                <Box component="form" sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label="Campaign Name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    required
                    margin="dense"
                    size="small"
                    sx={{ width: '80%', borderRadius: 1, boxShadow: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Notification Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    margin="dense"
                    size="small"
                    sx={{ width: '80%', borderRadius: 1, boxShadow: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Notification Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    multiline
                    rows={3}
                    margin="dense"
                    size="small"
                    sx={{ width: '80%', borderRadius: 1, boxShadow: 1 }}
                  />
                </Box>
              )}
              {index === 2 && (
                <Box component="form" sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    margin="dense"
                    size="small"
                    sx={{ width: '80%', borderRadius: 1, boxShadow: 1 }}
                  />
                  <TextField
                    fullWidth
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    required
                    margin="dense"
                    size="small"
                    sx={{ width: '80%', borderRadius: 1, boxShadow: 1 }}
                  />
                </Box>
              )}
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                  disabled={activeStep === 0 && (!campaignName || !title || !body)}
                >
                  {index === steps.length - 1 ? 'Finish' : 'Continue'}
                </Button>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
