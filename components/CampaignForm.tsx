'use client'
import React, { useState } from 'react';
import { storeCampaignToken, Campaign } from '../firebase/campaign';
import { requestNotificationPermission } from '../firebase/firebase';

export default function CampaignForm() {
  const [campaignName, setCampaignName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Acquire FCM token
    const token = await requestNotificationPermission();
    if (!token) return;

    // Store token in Firestore under a campaign
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignName
    };
    await storeCampaignToken(newCampaign, token);

    // Optionally send a notification to /api/send-notification
    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, title, body })
    });
    console.log('Notification response:', await response.json());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Campaign Name</label>
        <input
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Notification Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Notification Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>
      <button type="submit">Send Notification</button>
    </form>
  );
}