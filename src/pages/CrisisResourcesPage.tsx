import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone } from 'lucide-react';
import CrisisPlanCreator from '@/components/crisis/CrisisPlanCreator';
import SafetyAssessment from '@/components/crisis/SafetyAssessment';

const CrisisResourcesPage = () => {
  const [activeTab, setActiveTab] = useState('immediate');

  const emergencyContacts = [
    {
      name: 'Emergency Services',
      number: '911',
      description: 'Call for immediate danger or medical emergencies'
    },
    {
      name: 'Suicide & Crisis Lifeline',
      number: '988',
      description: 'Free, confidential support 24/7'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: '24/7 crisis support via text'
    }
  ];

  const mentalHealthResources = [
    {
      name: 'National Alliance on Mental Illness (NAMI)',
      url: 'https://www.nami.org',
      description: 'Support, education, and advocacy for mental health'
    },
    {
      name: 'Mental Health America (MHA)',
      url: 'https://www.mhanational.org',
      description: 'Advocacy, education, research, and support for mental health'
    },
    {
      name: 'The Trevor Project',
      url: 'https://www.thetrevorproject.org',
      description: 'Crisis intervention and suicide prevention for LGBTQ young people'
    }
  ];

  const supportGroups = [
    {
      name: 'NAMI Connection Recovery Support Group',
      description: 'Free, peer-led support group for adults with mental health conditions'
    },
    {
      name: 'Mental Health America Support Groups',
      description: 'Find local support groups through MHA'
    },
    {
      name: 'The Depression and Bipolar Support Alliance (DBSA)',
      description: 'Support groups for people with depression and bipolar disorder'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-red-800">Crisis Resources & Support</h1>
        <p className="text-red-700">Immediate help and resources for mental health emergencies</p>
      </div>

      <Tabs defaultValue="immediate" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="immediate">Immediate Help</TabsTrigger>
          <TabsTrigger value="assessment">Safety Check</TabsTrigger>
          <TabsTrigger value="plan">Crisis Plan</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="immediate">
          <Card className="p-6 bg-red-50 border border-red-200">
            <h2 className="text-xl font-semibold mb-4 text-red-800">Emergency Contacts</h2>
            <p className="text-red-700 mb-4">In case of immediate danger, contact these services:</p>
            <div className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-red-100 rounded-md">
                  <Phone className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <div className="font-medium text-red-800">{contact.name}</div>
                    <div className="text-sm text-red-700">{contact.number}</div>
                    <div className="text-xs text-red-600">{contact.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <SafetyAssessment />
        </TabsContent>

        <TabsContent value="plan">
          <CrisisPlanCreator />
        </TabsContent>

        <TabsContent value="resources">
          <Card className="p-6 bg-white/90">
            <h2 className="text-xl font-semibold mb-4">Mental Health Resources</h2>
            <p className="text-gray-600 mb-4">Explore these resources for support and information:</p>
            <div className="space-y-4">
              {mentalHealthResources.map((resource, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-md">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <div className="font-medium">{resource.name}</div>
                    <div className="text-sm text-gray-600">{resource.description}</div>
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card className="p-6 bg-white/90">
            <h2 className="text-xl font-semibold mb-4">Support Groups</h2>
            <p className="text-gray-600 mb-4">Connect with others who understand what you're going through:</p>
            <div className="space-y-4">
              {supportGroups.map((group, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-md">
                  <div>
                    <div className="font-medium">{group.name}</div>
                    <div className="text-sm text-gray-600">{group.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrisisResourcesPage;
