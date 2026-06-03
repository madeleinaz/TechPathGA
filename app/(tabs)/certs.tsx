// Certifications & Bootcamps — filterable cards ranked by Georgia employer demand.

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

//  Data 

type RecognitionLevel = 'Essential' | 'High' | 'Strong' | 'Growing';
type Category = 'Cloud' | 'Cybersecurity' | 'Networking' | 'State Program' | 'Bootcamp';

interface CertItem {
  id: string;
  name: string;
  provider: string;
  category: Category;
  cost: string;
  duration: string;
  recognition: RecognitionLevel;
  recognitionNote: string;
  description: string;
  tags: string[];
  stateFunded?: boolean;
}

const CERTS: CertItem[] = [
  {
    id: 'aws-cloud',
    name: 'AWS Certified Cloud Practitioner',
    provider: 'Amazon Web Services',
    category: 'Cloud',
    cost: '$100 – $150',
    duration: '4 – 8 weeks',
    recognition: 'Essential',
    recognitionNote: 'Required baseline at NCR Voyix, Delta Tech, Chime, and most Atlanta cloud teams.',
    description:
      "The entry point for cloud careers in Georgia. Atlanta's booming FinTech and logistics sectors have made AWS fluency table stakes for tech roles.",
    tags: ['Cloud', 'Entry Level', 'AWS'],
  },
  {
    id: 'aws-sa',
    name: 'AWS Solutions Architect – Associate',
    provider: 'Amazon Web Services',
    category: 'Cloud',
    cost: '$300 – $400',
    duration: '2 – 4 months',
    recognition: 'High',
    recognitionNote: 'Top requested cert at Georgia-based cloud consulting firms and Fortune 500s.',
    description:
      "Highly valued across Georgia's enterprise sector. Employers like Equifax, NCR Voyix, and Manhattan Associates actively recruit for this credential.",
    tags: ['Cloud', 'Mid Level', 'AWS', 'Architecture'],
  },
  {
    id: 'comptia-sec',
    name: 'CompTIA Security+',
    provider: 'CompTIA',
    category: 'Cybersecurity',
    cost: '$370 – $420',
    duration: '2 – 4 months',
    recognition: 'Essential',
    recognitionNote: 'DoD-approved; required for many federal contractor roles at Lockheed, SAIC, and Leidos in Georgia.',
    description:
      "The benchmark cybersecurity certification. With Georgia's large defense contracting presence at Dobbins ARB and Fort Eisenhower, Security+ is often non-negotiable.",
    tags: ['Cybersecurity', 'DoD Approved', 'Entry-Mid Level'],
  },
  {
    id: 'comptia-csa',
    name: 'CompTIA CySA+',
    provider: 'CompTIA',
    category: 'Cybersecurity',
    cost: '$350 – $400',
    duration: '3 – 5 months',
    recognition: 'High',
    recognitionNote: "Valued for SOC analyst roles at Georgia's growing cybersecurity firms.",
    description:
      "Focuses on threat detection and analysis. Increasingly sought after in Georgia's expanding cybersecurity sector, especially around the Augusta Cyber Center.",
    tags: ['Cybersecurity', 'Analytics', 'Mid Level'],
  },
  {
    id: 'cisco-ccna',
    name: 'Cisco CCNA',
    provider: 'Cisco',
    category: 'Networking',
    cost: '$280 – $350',
    duration: '2 – 4 months',
    recognition: 'Strong',
    recognitionNote: "Industry standard for network roles at Georgia's ISPs, data centers, and large enterprises.",
    description:
      "The gold standard for networking careers. Georgia's data center corridor in Lithia Springs and Douglasville and its telecom sector consistently seek CCNA holders.",
    tags: ['Networking', 'Infrastructure', 'Mid Level'],
  },
  {
    id: 'google-cloud',
    name: 'Google Cloud Professional',
    provider: 'Google',
    category: 'Cloud',
    cost: '$200 – $300',
    duration: '2 – 4 months',
    recognition: 'Growing',
    recognitionNote: "Increasingly recognized at Atlanta startups and Google's Midtown Atlanta offices.",
    description:
      "A strong credential for GCP-focused roles. With Google's major Midtown Atlanta presence, this certificate carries significant local weight.",
    tags: ['Cloud', 'Mid Level', 'Google', 'GCP'],
  },
  {
    id: 'ga-quickstart',
    name: 'Georgia Quick Start',
    provider: 'Technical College System of Georgia',
    category: 'State Program',
    cost: 'Free — State Funded',
    duration: 'Varies by program',
    recognition: 'High',
    recognitionNote: 'Directly partnered with Georgia employers — training is customized per company.',
    description:
      'One of the most respected workforce development programs in the US. Quick Start works directly with Georgia companies to design training, making graduates immediately job-ready for local employers.',
    tags: ['Free', 'State Funded', 'Workforce Training'],
    stateFunded: true,
  },
  {
    id: 'hope-career',
    name: 'HOPE Career Grant',
    provider: 'Georgia Student Finance Commission',
    category: 'State Program',
    cost: 'Free — Grant Covers Tuition',
    duration: 'Varies by program',
    recognition: 'High',
    recognitionNote: 'Covers tuition at TCSG colleges for high-demand tech programs.',
    description:
      'Covers tuition at Technical College System of Georgia institutions for programs in high-demand fields including IT, cybersecurity, and networking. Available to eligible Georgia residents.',
    tags: ['Free', 'Grant', 'TCSG', 'State Funded'],
    stateFunded: true,
  },
  {
    id: 'codefi-bootcamp',
    name: 'Codefi Works Bootcamp',
    provider: 'Codefi Works',
    category: 'Bootcamp',
    cost: '$5,000 – $12,000',
    duration: '12 – 24 weeks',
    recognition: 'Growing',
    recognitionNote: 'Atlanta-focused bootcamp with employer partnerships and hiring network.',
    description:
      "A Georgia-based coding bootcamp with direct pipelines into Atlanta's tech hiring ecosystem. Covers full-stack development with job placement support.",
    tags: ['Bootcamp', 'Full Stack', 'Atlanta'],
  },
  {
    id: 'georgia-tech-pe',
    name: 'Georgia Tech Professional Ed — Coding Bootcamp',
    provider: 'Georgia Tech',
    category: 'Bootcamp',
    cost: '$11,000 – $14,000',
    duration: '24 weeks',
    recognition: 'High',
    recognitionNote: 'Georgia Tech brand carries significant weight with local employers; strong alumni network.',
    description:
      "Backed by one of the top engineering schools in the nation. The GT name opens doors across Georgia's tech corridors — from Midtown's Tech Square to Cobb County's defense sector.",
    tags: ['Bootcamp', 'Full Stack', 'Georgia Tech', 'Prestigious'],
  },
];

//  Config 

const RECOGNITION_CONFIG: Record<RecognitionLevel, { color: string; bg: string }> = {
  Essential: { color: '#FFFFFF', bg: '#0A7C3E' },
  High:      { color: '#FFFFFF', bg: '#1A6FB0' },
  Strong:    { color: '#FFFFFF', bg: '#7B4F00' },
  Growing:   { color: '#FFFFFF', bg: '#5B3A8E' },
};

const CATEGORY_COLORS: Record<Category, string> = {
  Cloud:          '#0EA5E9',
  Cybersecurity:  '#EF4444',
  Networking:     '#F59E0B',
  'State Program':'#22C55E',
  Bootcamp:       '#A855F7',
};

const ALL_CATEGORIES: Category[] = ['Cloud', 'Cybersecurity', 'Networking', 'State Program', 'Bootcamp'];

//  Sub-components 

function RecognitionBadge({ level }: { level: RecognitionLevel }) {
  const cfg = RECOGNITION_CONFIG[level];
  return (
    <View style={[badgeStyles.badge, { backgroundColor: cfg.bg }]}>
      <ThemedText style={[badgeStyles.label, { color: cfg.color }]}>{level}</ThemedText>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={pillStyles.pill}>
      <ThemedText style={pillStyles.label}>{label}</ThemedText>
      <ThemedText style={pillStyles.value}>{value}</ThemedText>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  pill: {
    backgroundColor: '#131618',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    minWidth: 130,
  },
  label: {
    fontSize: 10, color: '#555',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3,
  },
  value: { fontSize: 13, fontWeight: '700', color: '#F0F0F0' },
});

function CertCard({ item }: { item: CertItem }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[item.category];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setExpanded((e) => !e)}
      style={[cardStyles.card, item.stateFunded && cardStyles.stateFundedCard]}
    >
      {/* Category stripe */}
      <View style={[cardStyles.stripe, { backgroundColor: catColor }]} />

      <View style={cardStyles.inner}>
        {/* Header */}
        <View style={cardStyles.headerRow}>
          <View style={cardStyles.headerText}>
            <ThemedText style={cardStyles.provider}>{item.provider}</ThemedText>
            <ThemedText style={cardStyles.name}>{item.name}</ThemedText>
          </View>
          <View style={[cardStyles.categoryChip, { borderColor: catColor }]}>
            <ThemedText style={[cardStyles.categoryLabel, { color: catColor }]}>
              {item.category}
            </ThemedText>
          </View>
        </View>

        {/* State funded banner */}
        {item.stateFunded && (
          <View style={cardStyles.stateBanner}>
            <ThemedText style={cardStyles.stateBannerText}>
              Georgia State-Funded Program
            </ThemedText>
          </View>
        )}

        {/* Recognition */}
        <RecognitionBadge level={item.recognition} />

        {/* Stat pills */}
        <View style={cardStyles.statsRow}>
          <StatPill label="Cost" value={item.cost} />
          <StatPill label="Duration" value={item.duration} />
        </View>

        {/* Expand toggle */}
        <TouchableOpacity
          style={cardStyles.expandBtn}
          onPress={() => setExpanded((e) => !e)}
        >
          <ThemedText style={cardStyles.expandLabel}>
            {expanded ? 'Hide details  ▲' : 'View details  ▼'}
          </ThemedText>
        </TouchableOpacity>

        {/* Expanded content */}
        {expanded && (
          <View style={cardStyles.expandedContent}>
            <View style={cardStyles.divider} />

            <ThemedText style={cardStyles.description}>{item.description}</ThemedText>

            <ThemedText style={cardStyles.sectionLabel}>Georgia Employer Recognition</ThemedText>
            <ThemedText style={cardStyles.recognitionNote}>{item.recognitionNote}</ThemedText>

            <View style={cardStyles.tagsRow}>
              {item.tags.map((tag) => (
                <View key={tag} style={cardStyles.tag}>
                  <ThemedText style={cardStyles.tagText}>{tag}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1D1F',
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2D2F',
  },
  stateFundedCard: {
    borderColor: '#22C55E',
    borderWidth: 1.5,
  },
  stripe: { width: 5 },
  inner: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  headerText: { flex: 1 },
  provider: {
    fontSize: 11, color: '#555',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 3,
  },
  name: { fontSize: 15, fontWeight: '700', color: '#F5F5F5', lineHeight: 22 },
  categoryChip: {
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    alignSelf: 'flex-start', marginTop: 2,
  },
  categoryLabel: {
    fontSize: 10, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.4,
  },
  stateBanner: {
    backgroundColor: '#052E16', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, marginBottom: 10,
  },
  stateBannerText: { fontSize: 11, color: '#4ADE80', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12, flexWrap: 'wrap' },
  expandBtn: { alignSelf: 'flex-start' },
  expandLabel: { fontSize: 12, color: '#60A5FA', fontWeight: '600' },
  expandedContent: { marginTop: 14 },
  divider: { height: 1, backgroundColor: '#2A2D2F', marginBottom: 12 },
  description: { fontSize: 13, color: '#C0C0C0', lineHeight: 20, marginBottom: 12 },
  sectionLabel: {
    fontSize: 10, color: '#555',
    textTransform: 'uppercase', letterSpacing: 0.6,
    marginBottom: 6, fontWeight: '700',
  },
  recognitionNote: {
    fontSize: 13, color: '#C0C0C0', lineHeight: 20, marginBottom: 12,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tag: {
    backgroundColor: '#2A2D2F', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  tagText: { fontSize: 11, color: '#AAA' },
});

//  Recognition Legend 

function RecognitionLegend() {
  return (
    <View style={legendStyles.container}>
      <ThemedText style={legendStyles.title}>Employer Recognition Scale</ThemedText>
      <View style={legendStyles.row}>
        {(Object.entries(RECOGNITION_CONFIG) as [RecognitionLevel, typeof RECOGNITION_CONFIG[RecognitionLevel]][]).map(
          ([level, cfg]) => (
            <View key={level} style={[legendStyles.item, { backgroundColor: cfg.bg }]}>
              <ThemedText style={legendStyles.itemText}>{level}</ThemedText>
            </View>
          )
        )}
      </View>
    </View>
  );
}

const legendStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1D1F', borderRadius: 12,
    padding: 14, marginBottom: 20,
    borderWidth: 1, borderColor: '#2A2D2F',
  },
  title: {
    fontSize: 11, color: '#555',
    textTransform: 'uppercase', letterSpacing: 0.6,
    marginBottom: 10, fontWeight: '700',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  item: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  itemText: {
    fontSize: 11, color: '#FFF', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.4,
  },
});

//  Filter Bar 

function FilterBar({
  active,
  onSelect,
}: {
  active: Category | 'All';
  onSelect: (c: Category | 'All') => void;
}) {
  const filters: (Category | 'All')[] = ['All', ...ALL_CATEGORIES];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={filterStyles.scroll}
      contentContainerStyle={filterStyles.content}
    >
      {filters.map((f) => {
        const isActive = active === f;
        const color = f === 'All' ? '#60A5FA' : CATEGORY_COLORS[f as Category];
        return (
          <TouchableOpacity
            key={f}
            onPress={() => onSelect(f)}
            style={[
              filterStyles.chip,
              isActive
                ? { backgroundColor: color, borderColor: color }
                : { borderColor: '#2A2D2F' },
            ]}
          >
            <ThemedText
              style={[filterStyles.chipText, { color: isActive ? '#000' : '#AAA' }]}
            >
              {f}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const filterStyles = StyleSheet.create({
  scroll: { marginBottom: 18 },
  content: { gap: 8, paddingRight: 8 },
  chip: { borderRadius: 20, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 7 },
  chipText: {
    fontSize: 12, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.4,
  },
});

//  Main Screen 

export default function CertsScreen() {
  const [activeFilter, setActiveFilter] = useState<Category | 'All'>('All');

  const filtered =
    activeFilter === 'All' ? CERTS : CERTS.filter((c) => c.category === activeFilter);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedText style={styles.title}>Certifications & Bootcamps</ThemedText>
        <ThemedText style={styles.subtitle}>
          Georgia market demand · Cost estimates · Employer recognition
        </ThemedText>

        {/* Recognition legend */}
        <RecognitionLegend />

        {/* Filter bar */}
        <FilterBar active={activeFilter} onSelect={setActiveFilter} />

        {/* Cert cards */}
        {filtered.map((cert) => (
          <CertCard key={cert.id} item={cert} />
        ))}

        {/* Footer */}
        <View style={styles.footerNote}>
          <ThemedText style={styles.footerText}>
            Tap any card to view Georgia employer recognition notes and program tags.
            State-funded programs are highlighted with a green border.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

//  Styles 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#151718' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 26, fontWeight: '800', color: '#F5F5F5', marginBottom: 6,
  },
  subtitle: {
    fontSize: 13, color: '#666', marginBottom: 20, letterSpacing: 0.3,
  },
  footerNote: {
    backgroundColor: '#1A1D1F', borderRadius: 10,
    padding: 14, marginTop: 8,
    borderWidth: 1, borderColor: '#2A2D2F',
  },
  footerText: { fontSize: 12, color: '#555', lineHeight: 18 },
});