import { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    } as admin.ServiceAccount),
  });
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { token, title, body, image, campaignId } = req.body as {
      token: string;
      title: string;
      body: string;
      image?: string;
      campaignId: string; // Ensure campaignId is included in the request
    };

    if (!token || !title || !body || !campaignId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = admin.firestore();

    // Fetch all device tokens from the 'devices' collection
    const devicesSnapshot = await db.collection("devices").get();
    const tokens = devicesSnapshot.docs.map(doc => doc.id);

    for (const token of tokens) {
      const message = {
        notification: {
          title,
          body,
        },
        data:{
          notificationId: `${token}_${Date.now()}`, // Unique ID for tracking
          campaignId
        },
        image: image || undefined,
        token,
      };

      try {
        await admin.messaging().send(message);

        // Store notification status with campaignId
        const notificationId = `${token}_${Date.now()}`;
        await db.collection("notifications").doc(notificationId).set({
          token,
          status: 'sent',
          campaignId, // Store campaignId instead of response
          sent_at: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.error(`Error sending notification to token ${token}:`, error);

        // Store failure status with campaignId
        await db.collection("notifications").doc(`${token}_${Date.now()}`).set({
          token,
          status: 'failed',
          campaignId, // Store campaignId even if it fails
          error: (error as Error).message,
          sent_at: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    res.status(200).json({ success: true, message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: (error as Error).message });
  }
}
