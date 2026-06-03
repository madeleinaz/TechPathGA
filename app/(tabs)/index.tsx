// Home screen —
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Four headline numbers shown in the stats bar beneath the hero section.
const QUICK_STATS = [
  { value: '6+',    label: 'GA Employers' },
  { value: '10+',   label: 'Certifications' },
  { value: '$65K+', label: 'Avg. Entry Pay' },
  { value: 'Free',  label: 'State Programs' },
];

// One card per tab. Each card renders with a colored left stripe and
// navigates to the corresponding route when tapped.
const FEATURE_CARDS = [
  {
    title: 'Tech Careers',
    subtitle: 'Explore roles at Delta, Google, Equifax, NCR Voyix, Home Depot, and Fiserv.',
    accentColor: '#60A5FA',
    route: '/(tabs)/careers',
    tag: 'Job Listings',
  },
  {
    title: 'Education Paths',
    subtitle: "Georgia Tech, UGA, KSU, GSU, Augusta University — degrees and transfer paths.",
    accentColor: '#4ADE80',
    route: '/(tabs)/education',
    tag: 'Universities',
  },
  {
    title: 'Certifications',
    subtitle: 'AWS, CompTIA Security+, Cisco CCNA — ranked by Georgia employer demand.',
    accentColor: '#F59E0B',
    route: '/(tabs)/certs',
    tag: 'Certs & Bootcamps',
  },
  {
    title: 'AI Advisor',
    subtitle: 'Ask anything about Georgia tech careers. Backed by live web search.',
    accentColor: '#22C55E',
    route: '/(tabs)/advisor',
    tag: 'Live AI',
  },
];

// Georgia-specific programs and districts shown in the Spotlight section.
const SPOTLIGHT_ITEMS = [
  {
    label: 'Georgia Quick Start',
    detail: 'Free state-funded training, customized by employer',
    color: '#22C55E',
  },
  {
    label: 'HOPE Career Grant',
    detail: 'Covers tuition at TCSG colleges for tech programs',
    color: '#4ADE80',
  },
  {
    label: 'Augusta Cyber Center',
    detail: "Georgia's hub for cybersecurity careers near Fort Eisenhower",
    color: '#60A5FA',
  },
  {
    label: 'Atlanta Tech Square',
    detail: 'Google, Georgia Tech, NCR Voyix — all within blocks',
    color: '#F59E0B',
  },
];

// Single stat cell used inside the horizontal stats bar.
function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <View style={statStyles.box}>
      <ThemedText style={statStyles.value}>{value}</ThemedText>
      <ThemedText style={statStyles.label}>{label}</ThemedText>
    </View>
  );
}

const statStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  value: { fontSize: 22, fontWeight: '800', color: '#F5F5F5', marginBottom: 3 },
  label: {
    fontSize: 10, color: '#555',
    textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center',
  },
});

// Tappable card in the Explore section. Left stripe color matches the
// destination tab's accent color. Calls onPress to trigger navigation.
function FeatureCard({
  card,
  onPress,
}: {
  card: typeof FEATURE_CARDS[0];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[featureStyles.card, { borderLeftColor: card.accentColor }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Colored left stripe — visual identity for each section */}
      <View style={[featureStyles.stripe, { backgroundColor: card.accentColor }]} />

      <View style={featureStyles.inner}>
        <View style={featureStyles.topRow}>
          {/* Category chip — e.g. "Job Listings", "Universities" */}
          <View style={[featureStyles.tagChip, { borderColor: card.accentColor }]}>
            <ThemedText style={[featureStyles.tagText, { color: card.accentColor }]}>
              {card.tag}
            </ThemedText>
          </View>
          <ThemedText style={featureStyles.arrow}>›</ThemedText>
        </View>
        <ThemedText style={featureStyles.title}>{card.title}</ThemedText>
        <ThemedText style={featureStyles.subtitle}>{card.subtitle}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const featureStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1D1F',
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2D2F',
  },
  stripe: { width: 5 },
  inner: { flex: 1, padding: 16 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagChip: {
    borderWidth: 1, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  tagText: {
    fontSize: 10, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  arrow: { fontSize: 20, color: '#444', fontWeight: '300' },
  title: { fontSize: 18, fontWeight: '800', color: '#F5F5F5', marginBottom: 5 },
  subtitle: { fontSize: 13, color: '#888', lineHeight: 19 },
});

// Single row in the Georgia Spotlight section. Colored dot + label + detail line.
function SpotlightRow({ item }: { item: typeof SPOTLIGHT_ITEMS[0] }) {
  return (
    <View style={spotlightStyles.row}>
      <View style={[spotlightStyles.dot, { backgroundColor: item.color }]} />
      <View style={spotlightStyles.text}>
        <ThemedText style={spotlightStyles.label}>{item.label}</ThemedText>
        <ThemedText style={spotlightStyles.detail}>{item.detail}</ThemedText>
      </View>
    </View>
  );
}

const spotlightStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2224',
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    marginTop: 5,
  },
  text: { flex: 1 },
  label: { fontSize: 14, fontWeight: '700', color: '#F0F0F0', marginBottom: 2 },
  detail: { fontSize: 12, color: '#666', lineHeight: 17 },
});

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.heroSection}>
          {/* Live indicator badge */}
          <View style={styles.heroBadge}>
            <View style={styles.heroBadgeDot} />
            <ThemedText style={styles.heroBadgeText}>Georgia Tech Career Platform</ThemedText>
          </View>
          <ThemedText style={styles.heroTitle}>TechPath GA</ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Your guide to computer science and technology careers in the state of Georgia.
            Explore employers, universities, certifications, and get live AI career advice.
          </ThemedText>
        </View>

        {/* ── Stats bar ── Four at-a-glance numbers about the Georgia tech market */}
        <View style={styles.statsBar}>
          {QUICK_STATS.map((s, i) => (
            <View key={s.label} style={styles.statWrapper}>
              <StatBox value={s.value} label={s.label} />
              {/* Vertical divider between cells — omit after last item */}
              {i < QUICK_STATS.length - 1 && (
                <View style={styles.statDivider} />
              )}
            </View>
          ))}
        </View>

        {/* ── Explore ── One card per tab; tapping navigates to that section */}
        <ThemedText style={styles.sectionHeader}>Explore</ThemedText>
        {FEATURE_CARDS.map((card) => (
          <FeatureCard
            key={card.title}
            card={card}
            onPress={() => router.push(card.route as any)}
          />
        ))}

        {/* ── Georgia Spotlight ── Programs and districts unique to GA */}
        <ThemedText style={[styles.sectionHeader, { marginTop: 28 }]}>
          Georgia Spotlight
        </ThemedText>
        <View style={styles.spotlightCard}>
          <ThemedText style={styles.spotlightIntro}>
            Resources and opportunities unique to the Georgia tech ecosystem.
          </ThemedText>
          {SPOTLIGHT_ITEMS.map((item) => (
            <SpotlightRow key={item.label} item={item} />
          ))}
        </View>

        {/* ── AI Advisor CTA ── Green-bordered card linking to the Advisor tab */}
        <TouchableOpacity
          style={styles.ctaCard}
          activeOpacity={0.82}
          onPress={() => router.push('/(tabs)/advisor' as any)}
        >
          <View style={styles.ctaLeft}>
            <ThemedText style={styles.ctaTitle}>Ask the AI Advisor</ThemedText>
            <ThemedText style={styles.ctaSubtitle}>
              Get personalized guidance on Georgia tech careers, salaries, certifications, and more.
            </ThemedText>
          </View>
          {/* Arrow button */}
          <View style={styles.ctaArrow}>
            <ThemedText style={styles.ctaArrowText}>›</ThemedText>
          </View>
        </TouchableOpacity>

        {/* ── Footer ── Scope disclaimer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            All career, salary, and program data is tailored to the Georgia job market.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#151718' },
  contentContainer: { padding: 20, paddingBottom: 48 },

  // Hero
  heroSection: { marginBottom: 24, paddingTop: 12 },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 14,
  },
  heroBadgeDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  heroBadgeText: {
    fontSize: 11, color: '#22C55E',
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#F5F5F5',
    letterSpacing: -1,
    marginBottom: 12,
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#777',
    lineHeight: 23,
  },

  // Stats bar — horizontal row of four metric boxes
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#1A1D1F',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2D2F',
    marginBottom: 28,
    overflow: 'hidden',
  },
  statWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2A2D2F',
    marginVertical: 12,
  },

  // Section headers — uppercase muted label above each content block
  sectionHeader: {
    fontSize: 11, fontWeight: '700', color: '#555',
    textTransform: 'uppercase', letterSpacing: 1.2,
    marginBottom: 14,
  },

  // Georgia Spotlight card
  spotlightCard: {
    backgroundColor: '#1A1D1F',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2D2F',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    marginBottom: 14,
  },
  spotlightIntro: {
    fontSize: 13, color: '#555', lineHeight: 19,
    marginBottom: 10,
  },

  // AI Advisor CTA — green-bordered call-to-action at bottom of screen
  ctaCard: {
    backgroundColor: '#1A2E1A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#22C55E',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 4,
    marginBottom: 28,
  },
  ctaLeft: { flex: 1 },
  ctaTitle: { fontSize: 16, fontWeight: '800', color: '#F5F5F5', marginBottom: 5 },
  ctaSubtitle: { fontSize: 13, color: '#4ADE80', lineHeight: 19 },
  ctaArrow: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#22C55E',
    alignItems: 'center', justifyContent: 'center',
  },
  ctaArrowText: { fontSize: 22, color: '#000', fontWeight: '300', lineHeight: 26 },

  // Footer
  footer: {
    borderTopWidth: 1, borderTopColor: '#1E2224',
    paddingTop: 16,
  },
  footerText: { fontSize: 12, color: '#444', lineHeight: 17, textAlign: 'center' },
});