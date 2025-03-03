import { getFirestore, doc, setDoc,getDoc} from 'firebase/firestore';

export interface Campaign {
  id: string;
  name: string;
  token?: string;
}

export async function storeCampaignToken(campaign: Campaign, token:string) {
  storeDeviceFCM(token);
  const db = getFirestore();
  await setDoc(doc(db, 'campaigns', campaign.id), {
    ...campaign,
    token,
  });
}

export async function storeDeviceFCM(token: string) {
  const db = getFirestore();
  const tokenRef = doc(db, 'devices', token);
  const checkToken = await getDoc(tokenRef);   if (checkToken.exists()) {
    return;
  }
  await setDoc(doc(db, 'devices', token), {
    token,
  });
}