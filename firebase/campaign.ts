import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseApp } from "./firebase";
export interface Campaign {
  id: string;
  name: string;
  title: string;
  text:string;
  image: string;
  send_at: Date;
}

export async function storeCampaignToken(campaign: Campaign) {
  const db = getFirestore(firebaseApp);
    await setDoc(doc(db, "campaigns", campaign.id), {
    ...campaign,
    created_at: serverTimestamp(),
    sent_count: 0,
    open_count: 0,
  });
}
