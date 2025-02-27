import { getFirestore, doc, setDoc } from 'firebase/firestore';

export interface Campaign {
  id: string;
  name: string;
  token?: string;
}

export async function storeCampaignToken(campaign: Campaign, token: string) {
  const db = getFirestore();
  await setDoc(doc(db, 'campaigns', campaign.id), {
    ...campaign,
    token
  });
}