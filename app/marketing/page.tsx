'use client'
import CampaignForm from "@/components/CampaignForm";
import { isTokenSet } from "../api/auth/session";
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    const session = isTokenSet();

    if (!session) {
        router.push('/marketing');
    }
    return (
        <div className="mt-10">
        <CampaignForm/>
        </div>
    );
}

