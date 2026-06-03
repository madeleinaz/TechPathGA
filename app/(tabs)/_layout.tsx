

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>

      {/* Home — overview, stats, quick links, and AI advisor CTA */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      {/* Advisor — AI chat screen powered by OpenAI Responses API + live web search */}
      <Tabs.Screen
        name="advisor"
        options={{
          title: 'Advisor',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message" color={color} />,
        }}
      />

      {/* Careers — job listings at Georgia's top tech employers */}
      <Tabs.Screen
        name="careers"
        options={{
          title: 'Careers',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="briefcase.fill" color={color} />,
        }}
      />

      {/* Education — degree pathways at Georgia universities and TCSG colleges */}
      <Tabs.Screen
        name="education"
        options={{
          title: 'Education',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="graduationcap.fill" color={color} />,
        }}
      />

      {/* Certifications — industry certs and state programs ranked by GA employer demand */}
      <Tabs.Screen
        name="certs"
        options={{
          title: 'Certifications',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="checkmark.seal.fill" color={color} />,
        }}
      />

    </Tabs>
  );
}