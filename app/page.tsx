import React from 'react';
import Head from 'next/head';
import NotificationComponent from '../components/NotificationComponent';
import CampaignForm from '@/components/CampaignForm';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Next.js with Firebase Cloud Messaging</title>
        <meta name="description" content="Push notifications example" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ margin: '20px', padding: '20px' }}>        {/* <h1>Next.js with Firebase Cloud Messaging</h1>
        <p>Enable notifications to receive updates</p> */}
        
        {/* Our notification component */}
        <NotificationComponent />
        <CampaignForm />
        {/* Rest of your page content */}
      </main>
    </div>
  );
};

export default Home;