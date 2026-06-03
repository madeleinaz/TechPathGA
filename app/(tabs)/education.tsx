// Education & Degree Pathways — Georgia universities and TCSG pathway cards.

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

//  Data 

const SCHOOLS = [
  {
    id: 'gatech',
    name: 'Georgia Tech',
    short: 'GT',
    accent: '#B3A369',
    type: '4-Year · Graduate',
    location: 'Atlanta, GA',
    tagline: 'Top-ranked CS and engineering programs nationally.',
    degrees: [
      'B.S. Computer Science',
      'M.S. Computer Science',
      'M.S. Cybersecurity',
      'Ph.D. CS / ML / HCI',
    ],
    highlights: [
      'No. 1 public CS graduate school in the Southeast',
      'OMSCS — affordable online master\'s (~$7K total)',
      'Strong ties to Google, Microsoft, Delta Technology',
    ],
  },
  {
    id: 'uga',
    name: 'University of Georgia',
    short: 'UGA',
    accent: '#BA0C2F',
    type: '4-Year · Graduate',
    location: 'Athens, GA',
    tagline: 'Broad CS foundation with strong career placement.',
    degrees: [
      'B.S. Computer Science',
      'B.S. Information Technology',
      'M.S. Computer Science',
      'M.S. Artificial Intelligence',
    ],
    highlights: [
      'Strong liberal arts and CS integration',
      'UGA Innovation District employer partnerships',
      'Athens and Atlanta dual recruiting pipeline',
    ],
  },
  {
    id: 'gsu',
    name: 'Georgia State University',
    short: 'GSU',
    accent: '#0039A6',
    type: '4-Year · Graduate',
    location: 'Atlanta, GA',
    tagline: 'Urban campus with direct access to Atlanta\'s tech hub.',
    degrees: [
      'B.S. Computer Science',
      'B.S. Information Systems',
      'M.S. Computer Science',
      'M.S. Data Science & Analytics',
    ],
    highlights: [
      'Downtown Atlanta location — direct recruiter access',
      'High diversity and first-generation student support',
      'Strong data science and analytics programs',
    ],
  },
  {
    id: 'ksu',
    name: 'Kennesaw State University',
    short: 'KSU',
    accent: '#FDBB30',
    type: '4-Year · Graduate',
    location: 'Kennesaw, GA',
    tagline: 'Hands-on tech and software development pathways.',
    degrees: [
      'B.S. Computer Science',
      'B.S. Software Engineering',
      'B.S. Information Technology',
      'M.S. Software Engineering',
    ],
    highlights: [
      'Practical project-based curriculum',
      'Strong industry partnerships in Cobb County',
      'Cybersecurity and cloud computing focus',
    ],
  },
  {
    id: 'au',
    name: 'Augusta University',
    short: 'AU',
    accent: '#005EB8',
    type: '4-Year · Graduate',
    location: 'Augusta, GA',
    tagline: 'Georgia\'s cybersecurity hub near Fort Eisenhower.',
    degrees: [
      'B.S. Computer Science',
      'B.S. Cybersecurity',
      'M.S. Information Security Management',
    ],
    highlights: [
      'Home of the Georgia Cyber Center',
      'Adjacent to Army Cyber Command at Fort Eisenhower',
      'Strong federal and defense contractor hiring pipeline',
    ],
  },
  {
    id: 'ung',
    name: 'University of North Georgia',
    short: 'UNG',
    accent: '#005596',
    type: '2-Year to 4-Year',
    location: 'Dahlonega / Gainesville, GA',
    tagline: 'Accessible CS education for North Georgia students.',
    degrees: [
      'A.S. Computer Science (transfer path)',
      'B.S. Computer Science',
      'B.S. Cybersecurity',
    ],
    highlights: [
      'Affordable entry point with clear 4-year track',
      'Military-friendly — ROTC and veteran support',
      'Small class sizes with strong academic advising',
    ],
  },
];

const PATHS = [
  {
    id: 'two',
    label: '2-Year',
    sublabel: 'Technical College',
    accent: '#4ADE80',
    duration: '~2 years',
    cost: '$3K – $8K / yr',
    description:
      'Associate degrees and certificates at Georgia\'s Technical College System (TCSG). A fast path to entry-level tech roles or a stepping stone to a 4-year degree. The HOPE Career Grant may cover tuition for eligible Georgia residents.',
    examples: [
      'Georgia Piedmont Technical College',
      'Gwinnett Technical College',
      'Atlanta Technical College',
      'Chattahoochee Technical College',
    ],
    outcomes: ['Web Developer', 'IT Support Specialist', 'Network Technician', 'Transfer to 4-Year'],
  },
  {
    id: 'four',
    label: '4-Year',
    sublabel: "Bachelor's Degree",
    accent: '#60A5FA',
    duration: '4 years',
    cost: '$10K – $32K / yr',
    description:
      "Bachelor's in CS, Software Engineering, or IT from a Georgia university. The standard credential for mid-to-senior tech roles at Georgia's top employers. HOPE Scholarship may reduce costs for eligible residents.",
    examples: [
      'Georgia Tech — Atlanta',
      'University of Georgia — Athens',
      'Georgia State University — Atlanta',
      'Kennesaw State University — Kennesaw',
    ],
    outcomes: ['Software Engineer', 'Data Analyst', 'Systems Architect', 'Product Manager'],
  },
  {
    id: 'grad',
    label: 'Graduate',
    sublabel: "Master's / PhD",
    accent: '#C084FC',
    duration: '1 – 5 years',
    cost: '$8K – $40K / yr',
    description:
      'Specialize in AI and ML, cybersecurity, data science, or systems engineering. Opens doors to research roles, senior engineering, and technical leadership. Georgia Tech\'s OMSCS is one of the most affordable accredited master\'s programs in the country.',
    examples: [
      "Georgia Tech OMSCS — online, ~$7K total",
      'UGA M.S. Artificial Intelligence',
      'GSU M.S. Data Science & Analytics',
      'Augusta University M.S. Information Security',
    ],
    outcomes: ['ML Engineer', 'Research Scientist', 'Tech Lead', 'Chief Technology Officer'],
  },
];

//  Sub-components 

function PathCard({ path }: { path: typeof PATHS[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={[pathCardStyles.card, { borderLeftColor: path.accent }]}
      onPress={() => setExpanded((e) => !e)}
      activeOpacity={0.85}
    >
      {/* Left stripe */}
      <View style={[pathCardStyles.stripe, { backgroundColor: path.accent }]} />

      <View style={pathCardStyles.inner}>
        {/* Header */}
        <View style={pathCardStyles.headerRow}>
          <View style={pathCardStyles.headerText}>
            <ThemedText style={[pathCardStyles.label, { color: path.accent }]}>
              {path.label}
            </ThemedText>
            <ThemedText style={pathCardStyles.sublabel}>{path.sublabel}</ThemedText>
          </View>
          <View style={pathCardStyles.pillRow}>
            <View style={[pathCardStyles.pill, { backgroundColor: path.accent + '22' }]}>
              <ThemedText style={[pathCardStyles.pillText, { color: path.accent }]}>
                {path.duration}
              </ThemedText>
            </View>
            <View style={[pathCardStyles.pill, { backgroundColor: path.accent + '22' }]}>
              <ThemedText style={[pathCardStyles.pillText, { color: path.accent }]}>
                {path.cost}
              </ThemedText>
            </View>
          </View>
        </View>

        <ThemedText style={pathCardStyles.description}>{path.description}</ThemedText>

        <TouchableOpacity
          onPress={() => setExpanded((e) => !e)}
          style={pathCardStyles.expandBtn}
        >
          <ThemedText style={[pathCardStyles.expandLabel, { color: path.accent }]}>
            {expanded ? 'Collapse  ▲' : 'View schools & outcomes  ▼'}
          </ThemedText>
        </TouchableOpacity>

        {expanded && (
          <View style={pathCardStyles.expandedContent}>
            <View style={pathCardStyles.divider} />

            <ThemedText style={pathCardStyles.sectionLabel}>Example Schools</ThemedText>
            {path.examples.map((e) => (
              <View key={e} style={pathCardStyles.bulletRow}>
                <ThemedText style={[pathCardStyles.bullet, { color: path.accent }]}>›</ThemedText>
                <ThemedText style={pathCardStyles.bulletText}>{e}</ThemedText>
              </View>
            ))}

            <ThemedText style={[pathCardStyles.sectionLabel, { marginTop: 14 }]}>
              Career Outcomes
            </ThemedText>
            <View style={pathCardStyles.outcomeRow}>
              {path.outcomes.map((o) => (
                <View
                  key={o}
                  style={[
                    pathCardStyles.outcomeBadge,
                    { borderColor: path.accent + '55', backgroundColor: path.accent + '18' },
                  ]}
                >
                  <ThemedText style={[pathCardStyles.outcomeText, { color: path.accent }]}>
                    {o}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const pathCardStyles = StyleSheet.create({
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
    marginBottom: 10,
    gap: 8,
  },
  headerText: { flex: 1 },
  label: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  sublabel: { fontSize: 12, color: '#666', marginTop: 2 },
  pillRow: { gap: 6, alignItems: 'flex-end' },
  pill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pillText: { fontSize: 11, fontWeight: '600' },
  description: { fontSize: 13, color: '#C0C0C0', lineHeight: 20, marginBottom: 12 },
  expandBtn: { alignSelf: 'flex-start' },
  expandLabel: { fontSize: 12, fontWeight: '600' },
  expandedContent: { marginTop: 14 },
  divider: { height: 1, backgroundColor: '#2A2D2F', marginBottom: 14 },
  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: '#555',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8,
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 5 },
  bullet: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  bulletText: { fontSize: 13, color: '#C0C0C0', lineHeight: 20, flex: 1 },
  outcomeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  outcomeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  outcomeText: { fontSize: 11, fontWeight: '600' },
});

function SchoolCard({ school }: { school: typeof SCHOOLS[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={[schoolCardStyles.card, { borderLeftColor: school.accent }]}
      onPress={() => setExpanded((e) => !e)}
      activeOpacity={0.85}
    >
      {/* Left stripe */}
      <View style={[schoolCardStyles.stripe, { backgroundColor: school.accent }]} />

      <View style={schoolCardStyles.inner}>
        {/* Header */}
        <View style={schoolCardStyles.headerRow}>
          <View
            style={[
              schoolCardStyles.initials,
              { backgroundColor: school.accent + '22', borderColor: school.accent + '44' },
            ]}
          >
            <ThemedText style={[schoolCardStyles.initialsText, { color: school.accent }]}>
              {school.short}
            </ThemedText>
          </View>
          <View style={schoolCardStyles.headerText}>
            <ThemedText style={schoolCardStyles.name}>{school.name}</ThemedText>
            <ThemedText style={schoolCardStyles.meta}>
              {school.location} · {school.type}
            </ThemedText>
          </View>
          <ThemedText style={schoolCardStyles.chevron}>{expanded ? '▲' : '▼'}</ThemedText>
        </View>

        <ThemedText style={schoolCardStyles.tagline}>{school.tagline}</ThemedText>

        {expanded && (
          <View style={schoolCardStyles.expandedContent}>
            <View style={schoolCardStyles.divider} />

            <ThemedText style={schoolCardStyles.sectionLabel}>Degrees Offered</ThemedText>
            {school.degrees.map((d) => (
              <View key={d} style={schoolCardStyles.bulletRow}>
                <ThemedText style={[schoolCardStyles.bullet, { color: school.accent }]}>›</ThemedText>
                <ThemedText style={schoolCardStyles.bulletText}>{d}</ThemedText>
              </View>
            ))}

            <ThemedText style={[schoolCardStyles.sectionLabel, { marginTop: 14 }]}>
              Why It Stands Out
            </ThemedText>
            {school.highlights.map((h) => (
              <View key={h} style={schoolCardStyles.bulletRow}>
                <ThemedText style={[schoolCardStyles.bullet, { color: school.accent }]}>+</ThemedText>
                <ThemedText style={schoolCardStyles.bulletText}>{h}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const schoolCardStyles = StyleSheet.create({
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
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  initials: {
    width: 44, height: 44, borderRadius: 10,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  initialsText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  headerText: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#F5F5F5' },
  meta: { fontSize: 12, color: '#555', marginTop: 2 },
  chevron: { fontSize: 11, color: '#555' },
  tagline: { fontSize: 13, color: '#C0C0C0', lineHeight: 18 },
  expandedContent: { marginTop: 14 },
  divider: { height: 1, backgroundColor: '#2A2D2F', marginBottom: 14 },
  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: '#555',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8,
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 5 },
  bullet: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  bulletText: { fontSize: 13, color: '#C0C0C0', lineHeight: 20, flex: 1 },
});

//  Main Screen 

export default function EducationScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedText style={styles.pageTitle}>Education &{'\n'}Degree Pathways</ThemedText>
        <ThemedText style={styles.pageSubtitle}>
          Georgia universities, technical colleges, and graduate programs for CS and tech careers.
        </ThemedText>

        {/* Stat row */}
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statValue}>{SCHOOLS.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Institutions</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statValue}>{PATHS.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Pathways</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statValue}>$0</ThemedText>
            <ThemedText style={styles.statLabel}>Min. w/ HOPE</ThemedText>
          </View>
        </View>

        {/* Path type section */}
        <ThemedText style={styles.sectionHeader}>Choose Your Path</ThemedText>
        {PATHS.map((path) => (
          <PathCard key={path.id} path={path} />
        ))}

        {/* Schools section */}
        <ThemedText style={[styles.sectionHeader, { marginTop: 28 }]}>
          Georgia Institutions
        </ThemedText>
        {SCHOOLS.map((school) => (
          <SchoolCard key={school.id} school={school} />
        ))}

        {/* Footer */}
        <View style={styles.footerNote}>
          <ThemedText style={styles.footerText}>
            Tap any card to view degrees, highlights, and career outcomes. HOPE Scholarship and
            HOPE Career Grant may significantly reduce costs for eligible Georgia residents.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

//  Styles 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#151718' },
  contentContainer: { padding: 20, paddingBottom: 60 },

  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F5F5F5',
    lineHeight: 36,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },

  statRow: {
    flexDirection: 'row',
    backgroundColor: '#1A1D1F',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2D2F',
    marginBottom: 28,
    overflow: 'hidden',
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#F5F5F5', marginBottom: 3 },
  statLabel: {
    fontSize: 10, color: '#555',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  statDivider: { width: 1, backgroundColor: '#2A2D2F', marginVertical: 12 },

  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  footerNote: {
    marginTop: 24,
    padding: 14,
    backgroundColor: '#1A1D1F',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2D2F',
  },
  footerText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
});