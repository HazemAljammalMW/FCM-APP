import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface Campaign {
  id: string;
  name: string;
  title: string;
  text:string;
  image: string;
}

export async function storeCampaignToken(campaign: Campaign) {
  const db = getFirestore();
  await setDoc(doc(db, "campaigns", campaign.id), {
    ...campaign,
    created_at: serverTimestamp(),
    sent_count: 0,
    open_count: 0,
  });
}

export async function storeDeviceFCM(token: string) {
  try {
    const db = getFirestore();
    const tokenRef = doc(db, "devices", token);
    const checkToken = await getDoc(tokenRef);
    if (checkToken.exists()) {
      return;
    }
    await setDoc(
      doc(db, "devices", token),
      {
        token,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (e) {
    console.log(e);
  }
}