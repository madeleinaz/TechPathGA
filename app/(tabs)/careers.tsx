// Tech Careers — expandable job cards, company filter bar, scroll-to-company navigation.

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

// Level drives the color of the LevelBadge on each card.
type Level = 'Entry-Level' | 'Mid-Level' | 'Senior';

// Company is used as the filter key and maps to an accent color.
// 'Other' catches NCR Voyix and Fiserv which don't have their own filter chip.
type Company = 'Delta' | 'Google' | 'Equifax' | 'Home Depot' | 'Other';

interface Job {
  company: Company;       // filter/accent key
  displayName: string;   // shown to the user (e.g. 'NCR Voyix')
  position: string;
  salary: string;
  level: Level;
  location: string;
  description: string;
  requirements: string;
  tags: string[];
}

const JOBS: Job[] = [
    {
    company: 'Delta',
    displayName: 'Delta',
    position: 'Software Developer',
    salary: '$75K – $120K / yr',
    level: 'Mid-Level',
    location: 'Atlanta, GA (Hartsfield HQ)',
    description:
      'Builds and maintains internal and customer-facing software systems for airline operations and digital services. Delta Tech is one of Atlanta\'s fastest-growing engineering divisions.',
    requirements:
      "Bachelor's in Computer Science or related field preferred. Java, REST APIs, and Git experience helpful. Agile team environment.",
    tags: ['Java', 'APIs', 'Agile', 'Atlanta'],
  },
  {
    company: 'Delta',
    displayName: 'Delta',
    position: 'Data Analyst',
    salary: '$65K – $95K / yr',
    level: 'Entry-Level',
    location: 'Atlanta, GA',
    description:
      'Analyzes operational and customer data to support reporting and business decision-making across Delta\'s global network.',
    requirements:
      "Bachelor's in CS, Data Analytics, or related field. SQL and Excel required. Tableau or Power BI a plus.",
    tags: ['SQL', 'Tableau', 'Excel', 'Entry Level'],
  },

    {
    company: 'Google',
    displayName: 'Google',
    position: 'Software Engineer',
    salary: '$130K – $200K+ / yr',
    level: 'Senior',
    location: 'Atlanta, GA (Google Midtown)',
    description:
      'Designs and scales large distributed systems across Google\'s cloud platform and consumer products. Google\'s Midtown Atlanta office is one of its fastest-growing US engineering hubs.',
    requirements:
      'Strong CS fundamentals, distributed systems, and system design experience required. Portfolio of large-scale projects expected.',
    tags: ['Distributed Systems', 'Cloud', 'Python', 'Go'],
  },
  {
    company: 'Google',
    displayName: 'Google',
    position: 'Cloud Support Engineer',
    salary: '$95K – $145K / yr',
    level: 'Mid-Level',
    location: 'Atlanta, GA',
    description:
      'Supports Google Cloud infrastructure, customer deployments, and scalable enterprise services for GCP clients headquartered in Georgia.',
    requirements:
      "Bachelor's in CS, IT, or related field. Google Cloud Professional or AWS certification strongly preferred.",
    tags: ['GCP', 'Cloud', 'Networking', 'Kubernetes'],
  },

    {
    company: 'Equifax',
    displayName: 'Equifax',
    position: 'Cybersecurity Analyst',
    salary: '$80K – $125K / yr',
    level: 'Mid-Level',
    location: 'Atlanta, GA (Equifax HQ)',
    description:
      'Monitors threats and protects critical systems handling financial data for millions of Americans. Equifax rebuilt its entire security posture after 2017 and is now a major cybersecurity employer in Georgia.',
    requirements:
      "Bachelor's in Cybersecurity, CS, or IT preferred. CompTIA Security+ or CISSP helpful. SOC experience a plus.",
    tags: ['SOC', 'Security+', 'SIEM', 'Incident Response'],
  },
  {
    company: 'Equifax',
    displayName: 'Equifax',
    position: 'Data Engineer',
    salary: '$90K – $130K / yr',
    level: 'Mid-Level',
    location: 'Atlanta, GA',
    description:
      'Builds and maintains large-scale data pipelines processing billions of financial records. Core infrastructure for Equifax\'s credit and analytics products.',
    requirements:
      "Bachelor's in CS, Data Engineering, or related field. Python, Spark, and SQL required. Cloud data platform experience preferred.",
    tags: ['Python', 'Spark', 'SQL', 'AWS', 'Data Pipelines'],
  },

    {
    company: 'Home Depot',
    displayName: 'Home Depot',
    position: 'Software Engineer',
    salary: '$85K – $140K / yr',
    level: 'Mid-Level',
    location: 'Atlanta, GA (Tech Hub, Midtown)',
    description:
      'Builds retail and e-commerce systems used by millions of customers. Home Depot\'s Atlanta Tech Hub is a 700,000 sq ft engineering campus — one of the largest in the Southeast.',
    requirements:
      "Bachelor's in CS or related field preferred. Modern web or backend development experience (React, Node, Java) helpful.",
    tags: ['React', 'Java', 'E-Commerce', 'Agile'],
  },
  {
    company: 'Home Depot',
    displayName: 'Home Depot',
    position: 'Cybersecurity Analyst',
    salary: '$78K – $120K / yr',
    level: 'Entry-Level',
    location: 'Atlanta, GA',
    description:
      'Supports threat monitoring, incident response, and enterprise security operations at one of the nation\'s largest retailers.',
    requirements:
      "Bachelor's in Cybersecurity, IT, or CS preferred. CompTIA Security+ or Network+ helpful. Entry-level candidates welcome.",
    tags: ['Security+', 'Network+', 'SOC', 'Entry Level'],
  },

    {
    company: 'Other',
    displayName: 'NCR Voyix',
    position: 'Software Engineer',
    salary: '$80K – $130K / yr',
    level: 'Mid-Level',
    location: 'Atlanta, GA (NCR Voyix HQ)',
    description:
      'Develops point-of-sale and financial technology platforms used by banks, retailers, and restaurants worldwide. NCR Voyix is headquartered in Atlanta and is one of Georgia\'s flagship tech employers.',
    requirements:
      "Bachelor's in CS or related field. Java or C++ experience preferred. Fintech or payments background a plus.",
    tags: ['Java', 'FinTech', 'Payments', 'Atlanta HQ'],
  },
  {
    company: 'Other',
    displayName: 'NCR Voyix',
    position: 'Cloud Infrastructure Engineer',
    salary: '$90K – $135K / yr',
    level: 'Mid-Level',
    location: 'Atlanta, GA',
    description:
      'Manages cloud infrastructure for NCR Voyix\'s global SaaS platforms, supporting banking and retail clients across 160+ countries.',
    requirements:
      'AWS or Azure certification required. Terraform, Kubernetes, and CI/CD pipeline experience preferred.',
    tags: ['AWS', 'Kubernetes', 'Terraform', 'DevOps'],
  },

    {
    company: 'Other',
    displayName: 'Fiserv',
    position: 'Software Developer',
    salary: '$75K – $115K / yr',
    level: 'Mid-Level',
    location: 'Alpharetta, GA',
    description:
      'Builds financial technology solutions for banks and credit unions. Fiserv\'s Alpharetta campus is a major hub for Georgia\'s growing FinTech corridor.',
    requirements:
      "Bachelor's in CS or related field preferred. Java, .NET, or Python experience helpful. Financial services background a plus.",
    tags: ['Java', '.NET', 'FinTech', 'Alpharetta'],
  },
  {
    company: 'Other',
    displayName: 'Fiserv',
    position: 'Data Analyst',
    salary: '$65K – $100K / yr',
    level: 'Entry-Level',
    location: 'Alpharetta, GA',
    description:
      'Analyzes payment transaction data and produces insights for banking clients. Strong opportunity for recent graduates entering Georgia\'s FinTech sector.',
    requirements:
      "Bachelor's in Data Analytics, CS, or related field. SQL required. Python or R a plus. Entry-level candidates welcome.",
    tags: ['SQL', 'Python', 'FinTech', 'Entry Level'],
  },
];

// Filter chips shown at the top of the screen.
// 'Other' groups NCR Voyix and Fiserv under one chip.
const COMPANIES: Company[] = ['Delta', 'Google', 'Equifax', 'Home Depot', 'Other'];

// Each company maps to a distinctive accent color used for the left card stripe
// and the active filter chip background.
const COMPANY_ACCENT: Record<Company, string> = {
  Delta:        '#60A5FA',
  Google:       '#F87171',
  Equifax:      '#A78BFA',
  'Home Depot': '#22C55E',
  Other:        '#F59E0B',
};

// Badge background and text color per seniority level.
const LEVEL_CONFIG: Record<Level, { bg: string; color: string }> = {
  'Entry-Level': { bg: '#052E16', color: '#4ADE80' },
  'Mid-Level':   { bg: '#1E3A5F', color: '#93C5FD' },
  Senior:        { bg: '#4A2B12', color: '#FBBF24' },
};

// Color-coded seniority badge displayed in the top-right of each card.
function LevelBadge({ level }: { level: Level }) {
  const cfg = LEVEL_CONFIG[level];
  return (
    <View style={[badgeStyles.wrap, { backgroundColor: cfg.bg }]}>
      <ThemedText style={[badgeStyles.text, { color: cfg.color }]}>{level}</ThemedText>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  wrap: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});

// Small info pill used for salary (green value) and location (default color).
function StatPill({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={pillStyles.wrap}>
      <ThemedText style={pillStyles.label}>{label}</ThemedText>
      <ThemedText style={[pillStyles.value, valueColor ? { color: valueColor } : {}]}>
        {value}
      </ThemedText>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  wrap: {
    backgroundColor: '#131618',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    minWidth: 130,
  },
  label: { fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  value: { fontSize: 13, fontWeight: '700', color: '#F0F0F0' },
});

// Expandable job card. Collapsed state shows company, position, salary, location,
// and skill tags. Expanded state adds description and requirements.
// onLayout records the card's Y position for scroll-to-company navigation.
function JobCard({ job, onLayout }: { job: Job; onLayout: (y: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const accent = COMPANY_ACCENT[job.company];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setExpanded((e) => !e)}
      onLayout={(e) => onLayout(e.nativeEvent.layout.y)}
      style={cardStyles.card}
    >
      {/* Left accent stripe — color matches the company filter chip */}
      <View style={[cardStyles.stripe, { backgroundColor: accent }]} />

      <View style={cardStyles.inner}>
        {/* Header row: company label, position title, level badge */}
        <View style={cardStyles.headerRow}>
          <View style={cardStyles.headerText}>
            <ThemedText style={cardStyles.companyLabel}>{job.displayName}</ThemedText>
            <ThemedText style={cardStyles.positionTitle}>{job.position}</ThemedText>
          </View>
          <LevelBadge level={job.level} />
        </View>

        {/* Salary and location pills */}
        <View style={cardStyles.pillRow}>
          <StatPill label="Salary" value={job.salary} valueColor="#4ADE80" />
          <StatPill label="Location" value={job.location} />
        </View>

        {/* Skill tags */}
        <View style={cardStyles.tagsRow}>
          {job.tags.map((tag) => (
            <View key={tag} style={cardStyles.tag}>
              <ThemedText style={cardStyles.tagText}>{tag}</ThemedText>
            </View>
          ))}
        </View>

        {/* Expand/collapse toggle */}
        <TouchableOpacity
          onPress={() => setExpanded((e) => !e)}
          style={cardStyles.expandBtn}
        >
          <ThemedText style={cardStyles.expandLabel}>
            {expanded ? 'Hide details   ▲' : 'View details   ▼'}
          </ThemedText>
        </TouchableOpacity>

        {/* Expanded content — description and requirements */}
        {expanded && (
          <View style={cardStyles.expandedContent}>
            <View style={cardStyles.divider} />

            <ThemedText style={cardStyles.sectionLabel}>What you will do</ThemedText>
            <ThemedText style={cardStyles.bodyText}>{job.description}</ThemedText>

            <ThemedText style={[cardStyles.sectionLabel, { marginTop: 14 }]}>
              Requirements
            </ThemedText>
            <ThemedText style={cardStyles.bodyText}>{job.requirements}</ThemedText>
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
  stripe: { width: 5 },
  inner: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  headerText: { flex: 1 },
  companyLabel: {
    fontSize: 11, color: '#666',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 3,
  },
  positionTitle: { fontSize: 17, fontWeight: '700', color: '#F5F5F5', lineHeight: 23 },
  pillRow: { flexDirection: 'row', gap: 10, marginBottom: 12, flexWrap: 'wrap' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag: {
    backgroundColor: '#2A2D2F', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  tagText: { fontSize: 11, color: '#AAA' },
  expandBtn: { alignSelf: 'flex-start' },
  expandLabel: { fontSize: 12, color: '#60A5FA', fontWeight: '600' },
  expandedContent: { marginTop: 14 },
  divider: { height: 1, backgroundColor: '#2A2D2F', marginBottom: 14 },
  sectionLabel: {
    fontSize: 11, color: '#666',
    textTransform: 'uppercase', letterSpacing: 0.6,
    fontWeight: '600', marginBottom: 6,
  },
  bodyText: { fontSize: 13, color: '#C0C0C0', lineHeight: 20 },
});

// Horizontal scrollable filter bar. Active chip gets a solid background;
// inactive chips show only a border.
function FilterBar({
  active,
  onSelect,
}: {
  active: Company | 'All';
  onSelect: (c: Company | 'All') => void;
}) {
  const filters: (Company | 'All')[] = ['All', ...COMPANIES];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={filterStyles.scroll}
      contentContainerStyle={filterStyles.content}
    >
      {filters.map((f) => {
        const isActive = active === f;
        const color = f === 'All' ? '#60A5FA' : COMPANY_ACCENT[f as Company];
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
  chip: {
    borderRadius: 20, borderWidth: 1.5,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  chipText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
});

export default function CareersScreen() {
  const scrollRef = useRef<ScrollView>(null);

  // Stores the first Y position of each company's card group so the filter
  // bar can scroll to it when a company chip is selected.
  const [companyPositions, setCompanyPositions] = useState<Record<string, number>>({});
  const [activeFilter, setActiveFilter] = useState<Company | 'All'>('All');

  // Record Y position only the first time a company card is laid out.
  const handleLayout = (company: Company, y: number) => {
    setCompanyPositions((prev) => {
      if (prev[company] !== undefined) return prev;
      return { ...prev, [company]: y };
    });
  };

  // Update filter state and scroll to the company's first card if a company is selected.
  const handleFilterSelect = (f: Company | 'All') => {
    setActiveFilter(f);
    if (f !== 'All') {
      const y = companyPositions[f];
      if (scrollRef.current && y !== undefined) {
        scrollRef.current.scrollTo({ y: Math.max(y - 12, 0), animated: true });
      }
    }
  };

  // When a company filter is active, show only that company's jobs.
  const filtered =
    activeFilter === 'All' ? JOBS : JOBS.filter((j) => j.company === activeFilter);

  return (
    <ThemedView style={styles.container}>
      {/* Fixed header — does not scroll */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.headerTitle}>Tech Careers in Georgia</ThemedText>
          <ThemedText style={styles.headerSub}>
            Leading employers across Atlanta, Alpharetta, and beyond
          </ThemedText>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Company filter chips */}
        <FilterBar active={activeFilter} onSelect={handleFilterSelect} />

        {/* Summary stats — total roles, employers, starting salary floor */}
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statValue}>{JOBS.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Open Roles</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statValue}>{COMPANIES.length}</ThemedText>
            <ThemedText style={styles.statLabel}>GA Employers</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statValue}>$65K+</ThemedText>
            <ThemedText style={styles.statLabel}>Starting Salary</ThemedText>
          </View>
        </View>

        {/* Job cards — filtered list */}
        {filtered.map((job, index) => (
          <JobCard
            key={`${job.company}-${job.position}-${index}`}
            job={job}
            onLayout={(y) => handleLayout(job.company, y)}
          />
        ))}

        {/* Footer disclaimer */}
        <View style={styles.footerNote}>
          <ThemedText style={styles.footerText}>
            Tap any card to view full job description and requirements. Salaries reflect
            Georgia market ranges and may vary by experience and location.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#151718' },

  // Fixed header above the scroll area
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2224',
    backgroundColor: '#151718',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#F5F5F5' },
  headerSub: { fontSize: 12, color: '#555', marginTop: 3, letterSpacing: 0.2 },

  contentContainer: { padding: 20, paddingBottom: 40 },

  // Summary stat row
  statRow: {
    flexDirection: 'row',
    backgroundColor: '#1A1D1F',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2D2F',
    marginBottom: 20,
    overflow: 'hidden',
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#F5F5F5', marginBottom: 3 },
  statLabel: {
    fontSize: 10, color: '#555',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  statDivider: { width: 1, backgroundColor: '#2A2D2F', marginVertical: 12 },

  // Footer note
  footerNote: {
    backgroundColor: '#1A1D1F',
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#2A2D2F',
  },
  footerText: { fontSize: 12, color: '#555', lineHeight: 18 },
});