import { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    } as admin.ServiceAccount),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { notificationId } = req.body;
  if (!notificationId) {
    return res.status(400).json({ error: 'Missing notificationId' });
  }

  try {
    const db = admin.firestore();
    await db.collection("notifications").doc(notificationId).update({
      status: "opened",
      opened_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ success: true, message: 'Notification status updated' });
  } catch (error) {
    console.error('Error updating notification status:', error);
    return res.status(500).json({ error: 'Failed to update notification status' });
  }
}
