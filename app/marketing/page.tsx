'use client'
import CampaignForm from "@/components/CampaignForm";
import { isTokenSet } from "../api/auth/session";
import { useRouter } from 'next/navigation';

export default function Page() {

    return (
        <div className="mt-10">
        <CampaignForm/>
        </div>
    );
}

