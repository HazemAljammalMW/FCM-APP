import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Scheduled Cloud Function
export const scheduledNotifications = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = new Date();

    // Query campaigns that are due to be sent and not marked as sent
    const snapshot = await db
      .collection("campaigns")
      .where("scheduled_at", "<=", now)
      .where("sent", "==", false)
      .get();

    if (snapshot.empty) {
      console.log("No pending campaigns to process.");
      return null;
    }

    snapshot.forEach(async (doc) => {
      const campaign = doc.data();
      const campaignId = campaign.id;

      // Fetch all device tokens from the 'devices' collection
      const devicesSnapshot = await db.collection("devices").get();
      const tokens = devicesSnapshot.docs.map((d) => d.id);

      // Prepare the message payload
      const message = {
        notification: {
          title: campaign.title,
          body: campaign.text,
        },
        data: {
          campaignId: campaignId,
        },
        image: campaign.image || undefined,
      };

      // Send notification to each token
      tokens.forEach(async (token: string) => {
        try {
          await admin.messaging().send({ ...message, token });
          console.log(`Notification sent to ${token}`);
        } catch (error) {
          console.error(`Error sending notification to token ${token}:`, error);
        }
      });

      // Mark the campaign as sent
      await db.collection("campaigns").doc(campaignId).update({
        sent: true,
        sent_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return null;
  });
