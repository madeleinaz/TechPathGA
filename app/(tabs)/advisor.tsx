// AI Career Advisor — OpenAI Responses API with live web search, Georgia-specific system prompt.

import { ThemedText } from '@/components/themed-text';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
import OpenAI from 'openai';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardEvent,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//  Validate API Key on startup 
if (!OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is missing. Add it to your .env file.');
}

//  Types 

type Role = 'user' | 'assistant';
type Tier = 'beginner' | 'career-changer' | 'experienced';

interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: string;
}

//  Tier Config 

const TIER_LABELS: Record<Tier, string> = {
  beginner:         'Beginner',
  'career-changer': 'Career Changer',
  experienced:      'Experienced Pro',
};

const TIER_COLORS: Record<Tier, string> = {
  beginner:         '#22C55E',
  'career-changer': '#F59E0B',
  experienced:      '#60A5FA',
};

//  Example Queries 

const EXAMPLE_QUERIES = [
  'How do I become a cybersecurity analyst in Georgia?',
  'What certifications are valued in Atlanta tech jobs?',
  'What does a software engineer earn in Georgia?',
  'Best CS degree programs in Georgia?',
  'How do I break into fintech in Atlanta?',
  'What is Georgia Quick Start and how does it work?',
];

//  Fallback 

const FALLBACK_TEXT =
  'I specialize in computer science and technology careers within the state of Georgia. I can help with tech career paths, certifications, degree programs, and job opportunities in Georgia. Please ask me about a tech career or education pathway in Georgia.';

//  System Prompt 

const buildSystemPrompt = (tier: Tier): string =>
  `You are TechPath GA, a knowledgeable AI career advisor focused exclusively on computer science and technology careers in the state of Georgia.

Your job is to HELP users. Be generous in what you consider on-topic. If someone asks about a tech career, certification, degree program, salary, employer, or job in Georgia, answer it fully with Georgia-specific context and detail.

Only use the fallback message if the question is clearly unrelated to technology or careers entirely (e.g., cooking, sports scores, weather).

CURRENT USER LEVEL: ${
    tier === 'beginner'
      ? 'Beginner — new to tech, needs clear foundational step-by-step guidance'
      : tier === 'career-changer'
      ? 'Career Changer — transitioning from a non-tech field, needs practical and realistic entry points'
      : 'Experienced Professional — already working in tech, looking to advance, specialize, or pivot'
  }

RESPONSE FORMATTING — follow these rules every time:
1. Use bullet points starting with a dash (-) for any list of jobs, skills, certifications, or programs
2. Include salary ranges when relevant, formatted like: $65,000 - $95,000 per year
3. Bold key terms using **double asterisks**: **job titles**, **company names**, **institution names**, **certification names**
4. Always structure guidance into these three tiers, leading with the user's current level:
   Beginner Path
   Career Changer Path
   Experienced Pro Path
5. Label each section clearly:
   Georgia-Specific: when referencing Georgia employers, universities, or state programs
   General: when giving broad industry advice that applies anywhere
6. Keep responses focused and actionable. No more than 3 main sections per response.
7. Do not use any emoji characters in your responses.

GEORGIA STATE CONTEXT — always weave this in where relevant:

Employers:
- **NCR Voyix** — Atlanta HQ, payments and financial technology
- **Equifax** — Atlanta HQ, data and cybersecurity, major rebuilding effort since 2017
- **Delta Technology** — Atlanta, airline tech and software engineering
- **Home Depot Tech Hub** — Atlanta Midtown, one of the largest retail tech campuses in the Southeast
- **Fiserv** — Alpharetta, financial technology and banking software
- **Global Payments** — Atlanta, payment processing and FinTech
- **Manhattan Associates** — Atlanta, supply chain and enterprise software
- **Chime** — Atlanta office, consumer FinTech
- **Mailchimp** — Atlanta, marketing technology (Intuit-owned)
- **Pindrop** — Atlanta, voice security and fraud detection
- **Honeywell** — Atlanta, industrial and enterprise technology
- **Salesforce** — Atlanta office, CRM and cloud software

Universities and Colleges:
- **Georgia Institute of Technology (Georgia Tech)** — Atlanta, top-ranked CS and engineering programs nationally
- **Georgia State University** — Atlanta, strong CS and data science programs, urban-serving
- **Kennesaw State University** — Kennesaw, growing CS and cybersecurity programs, large enrollment
- **University of Georgia** — Athens, CS, data science, and MIS programs
- **Augusta University** — Augusta, strong cybersecurity focus near the Army Cyber Center of Excellence
- **Mercer University** — Macon and Atlanta, engineering and CS programs
- **Savannah College of Art and Design (SCAD)** — Savannah, UX and interactive design
- **Technical College System of Georgia (TCSG)** — statewide, workforce-focused IT and networking programs

State Programs:
- **Georgia Quick Start** — free, employer-customized workforce training program run by the state; one of the most respected in the US
- **HOPE Career Grant** — covers tuition at TCSG colleges for programs in high-demand fields including IT, cybersecurity, and networking
- **Georgia Cyber Center** — Augusta, major state investment in cybersecurity education and workforce development

Georgia Tech Regions:
- Atlanta Midtown / Tech Square — primary hub, Google, Georgia Tech, Home Depot Tech Hub, NCR Voyix
- Alpharetta / North Fulton — major FinTech corridor, Fiserv, many software companies
- Augusta — cybersecurity focus, Army Cyber Command at Fort Eisenhower, Augusta University Cyber Institute
- Savannah — growing logistics tech sector tied to the Port of Savannah
- Columbus — Aflac technology operations, military technology near Fort Moore

Salary Context:
- Georgia and Atlanta salaries are competitive with US national averages
- Typically 10 to 15 percent below San Francisco Bay Area rates
- Significantly lower cost of living than major coastal tech markets makes Georgia attractive in real purchasing power
- Use web search to pull current and accurate salary data when asked

Certifications valued by Georgia employers:
- **AWS Certified Cloud Practitioner** and **AWS Solutions Architect** — essential for cloud roles
- **CompTIA Security+** — required or preferred for most cybersecurity roles, especially in defense contracting
- **Cisco CCNA** — strong for networking and infrastructure roles
- **Google Cloud Professional** — valued at Google Atlanta and GCP-focused companies
- **Certified Ethical Hacker (CEH)** — relevant for security roles in Augusta cyber sector
- **PMP** — valued for technical project management roles

Use web search to verify current job postings, live salary data, certification costs, and upcoming Georgia tech events when relevant.

OFF-TOPIC FALLBACK — only use this exact message if the question has nothing to do with technology or careers:
"I specialize in computer science and technology careers within the state of Georgia. I can help with tech career paths, certifications, degree programs, and job opportunities in Georgia. Please ask me about a tech career or education pathway in Georgia."`;

//  Agent Config

const buildAgentConfig = (tier: Tier) => ({
  model: 'gpt-4o-mini',
  tools: [{ type: 'web_search_preview' as const }],
  systemPrompt: buildSystemPrompt(tier),
});

//  OpenAI Client

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

//  Agent Layer 
// Pure async function — no UI concerns, easy to unit-test.

async function runAdvisorAgent(userQuery: string, tier: Tier): Promise<string> {
  const config = buildAgentConfig(tier);

  const result = await client.responses.create({
    model: config.model,
    tools: config.tools,
    input: [
      { role: 'system', content: config.systemPrompt },
      { role: 'user',   content: userQuery },
    ],
  });

  return result.output_text ?? FALLBACK_TEXT;
}

function parseBold(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <ThemedText key={i} style={mdStyles.bold}>
        {part}
      </ThemedText>
    ) : (
      part
    )
  );
}

function renderFormattedText(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      nodes.push(<View key={key++} style={{ height: 6 }} />);
      continue;
    }

    const isBullet =
      trimmed.startsWith('•') ||
      trimmed.startsWith('-') ||
      /^\d+\./.test(trimmed);

    const displayLine = isBullet
      ? trimmed.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '')
      : trimmed;

    const segments = parseBold(displayLine);

    if (isBullet) {
      nodes.push(
        <View key={key++} style={mdStyles.bulletRow}>
          <ThemedText style={mdStyles.bullet}>•</ThemedText>
          <ThemedText style={mdStyles.bulletText}>{segments}</ThemedText>
        </View>
      );
    } else if (trimmed.startsWith('###')) {
      nodes.push(
        <ThemedText key={key++} style={mdStyles.h3}>
          {parseBold(trimmed.replace(/^###\s*/, ''))}
        </ThemedText>
      );
    } else if (trimmed.startsWith('##')) {
      nodes.push(
        <ThemedText key={key++} style={mdStyles.h2}>
          {parseBold(trimmed.replace(/^##\s*/, ''))}
        </ThemedText>
      );
    } else if (trimmed.startsWith('#')) {
      nodes.push(
        <ThemedText key={key++} style={mdStyles.h1}>
          {parseBold(trimmed.replace(/^#\s*/, ''))}
        </ThemedText>
      );
    } else {
      nodes.push(
        <ThemedText key={key++} style={mdStyles.body}>
          {segments}
        </ThemedText>
      );
    }
  }
  return nodes;
}

const mdStyles = StyleSheet.create({
  h1:        { fontSize: 16, fontWeight: '800', color: '#F5F5F5', marginTop: 12, marginBottom: 5 },
  h2:        { fontSize: 15, fontWeight: '700', color: '#E2E8F0', marginTop: 10, marginBottom: 4 },
  h3:        { fontSize: 13, fontWeight: '700', color: '#CBD5E1', marginTop: 8,  marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
  body:      { fontSize: 14, color: '#C0C0C0', lineHeight: 21 },
  bold:      { fontWeight: '800', color: '#F5F5F5' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 3, gap: 8 },
  bullet:    { fontSize: 14, color: '#22C55E', lineHeight: 21 },
  bulletText:{ flex: 1, fontSize: 14, color: '#C0C0C0', lineHeight: 21 },
});

// Shows only when response contains Georgia-specific content

function GeorgiaBadge({ text }: { text: string }) {
  const isGeorgia = text.toLowerCase().includes('georgia') ||
                    text.toLowerCase().includes('atlanta') ||
                    text.toLowerCase().includes('augusta');
  if (!isGeorgia) return null;
  return (
    <View style={gbStyles.badge}>
      <ThemedText style={gbStyles.text}>Georgia-Tailored Response</ThemedText>
    </View>
  );
}

const gbStyles = StyleSheet.create({
  badge: {
    backgroundColor: '#052E16',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#166534',
  },
  text: { fontSize: 10, color: '#4ADE80', fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
});

// Message Bubble

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <View style={[bubbleStyles.wrapper, isUser ? bubbleStyles.userWrapper : bubbleStyles.asstWrapper]}>
      {!isUser && (
        <View style={bubbleStyles.avatar}>
          <ThemedText style={bubbleStyles.avatarText}>GA</ThemedText>
        </View>
      )}
      <View style={bubbleStyles.bubbleCol}>
        <ThemedText style={bubbleStyles.label}>
          {isUser ? 'You' : 'TechPath GA'} · {msg.timestamp}
        </ThemedText>
        <View style={[bubbleStyles.bubble, isUser ? bubbleStyles.userBubble : bubbleStyles.asstBubble]}>
          {!isUser && <GeorgiaBadge text={msg.text} />}
          {isUser ? (
            <ThemedText style={bubbleStyles.userText}>{msg.text}</ThemedText>
          ) : (
            renderFormattedText(msg.text)
          )}
        </View>
      </View>
    </View>
  );
}

const bubbleStyles = StyleSheet.create({
  wrapper:     { flexDirection: 'row', marginBottom: 14, maxWidth: '88%' },
  userWrapper: { alignSelf: 'flex-end',  justifyContent: 'flex-end' },
  asstWrapper: { alignSelf: 'flex-start', gap: 8 },
  avatar: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#1A2E1A', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#22C55E', marginTop: 18,
  },
  avatarText: { fontSize: 10, fontWeight: '800', color: '#22C55E', letterSpacing: 0.5 },
  bubbleCol:  { flex: 1 },
  label:      { fontSize: 11, color: '#555', marginBottom: 4, paddingHorizontal: 4 },
  bubble:     { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  userBubble: { backgroundColor: '#1D4ED8', borderBottomRightRadius: 4 },
  asstBubble: {
    backgroundColor: '#1A1D1F', borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: '#2A2D2F',
  },
  userText: { fontSize: 14, color: '#FFFFFF', lineHeight: 21, fontWeight: '500' },
});

// Typing Indicator
function TypingIndicator() {
  return (
    <View style={typingStyles.wrapper}>
      <View style={typingStyles.avatar}>
        <ThemedText style={typingStyles.avatarText}>GA</ThemedText>
      </View>
      <View style={typingStyles.bubble}>
        <ActivityIndicator size="small" color="#22C55E" />
        <ThemedText style={typingStyles.label}>Researching Georgia tech careers...</ThemedText>
      </View>
    </View>
  );
}

const typingStyles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  avatar:  {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#1A2E1A', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#22C55E',
  },
  avatarText: { fontSize: 10, fontWeight: '800', color: '#22C55E', letterSpacing: 0.5 },
  bubble: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1A1D1F', borderRadius: 14, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: '#2A2D2F',
  },
  label: { fontSize: 13, color: '#555', fontStyle: 'italic' },
});

// Tier Selector

function TierSelector({ active, onChange }: { active: Tier; onChange: (t: Tier) => void }) {
  return (
    <View style={tierStyles.row}>
      {(Object.keys(TIER_LABELS) as Tier[]).map((t) => {
        const isActive = active === t;
        const color    = TIER_COLORS[t];
        return (
          <TouchableOpacity
            key={t}
            onPress={() => onChange(t)}
            style={[
              tierStyles.chip,
              isActive
                ? { backgroundColor: color, borderColor: color }
                : { borderColor: '#2A2D2F' },
            ]}
          >
            <ThemedText style={[tierStyles.label, { color: isActive ? '#000' : '#666' }]}>
              {TIER_LABELS[t]}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tierStyles = StyleSheet.create({
  row:   { flexDirection: 'row', gap: 6, flexWrap: 'wrap', paddingHorizontal: 16, paddingBottom: 12 },
  chip:  { borderRadius: 20, borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 6 },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
});

export default function AdvisorScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: [
        'Welcome to TechPath GA.',
        '',
        'I am your Georgia tech career advisor with live web search. I can help with:',
        '- **Career paths** in Georgia\'s top tech sectors',
        '- **Certifications** valued by Georgia employers',
        '- **Degree programs** at Georgia institutions',
        '- **Salary ranges** for Georgia tech roles',
        '- **State programs** like Georgia Quick Start and the HOPE Career Grant',
        '- **Job opportunities** across Atlanta, Alpharetta, Augusta, and beyond',
        '',
        'Select your experience level below, then ask me anything about tech careers in Georgia.',
      ].join('\n'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [tier,    setTier]    = useState<Tier>('beginner');
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = useCallback(
    async (text?: string) => {
      const trimmed = (text ?? input).trim();
      if (!trimmed || loading) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);
      setError(null);
      Keyboard.dismiss();
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

      try {
        const agentResponse = await runAdvisorAgent(trimmed, tier);

        const asstMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: agentResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, asstMsg]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
      } catch (err) {
        console.error('Agent error:', err);
        setError('Connection failed. Check your API key and network connection.');
      } finally {
        setLoading(false);
      }
    },
    [input, loading, tier]
  );

  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      // Scroll to bottom so latest message stays visible above keyboard
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });
    return () => { show.remove(); hide.remove(); };
  }, []);

  return (
    // Outer view handles safe area top (notch/status bar)
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>

      {/* Header — fixed, never moves */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.headerTitle}>Career Advisor</ThemedText>
          <ThemedText style={styles.headerSub}>
            Georgia Tech Career Intelligence · Live Web Search
          </ThemedText>
        </View>
        <View style={styles.statusDot} />
      </View>

      {/* Tier selector — fixed, never moves */}
      <View style={styles.tierSection}>
        <ThemedText style={styles.tierSectionLabel}>Your level</ThemedText>
        <TierSelector active={tier} onChange={setTier} />
      </View>

      {/* Chat area — scrollable, fills remaining space */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {loading && <TypingIndicator />}

        {error && (
          <View style={styles.errorBox}>
            <ThemedText style={styles.errorText}>Connection failed. Check your API key and network.</ThemedText>
          </View>
        )}

        {messages.length === 1 && !loading && (
          <View style={styles.examplesContainer}>
            <ThemedText style={styles.examplesLabel}>Suggested questions</ThemedText>
            {EXAMPLE_QUERIES.map((q) => (
              <TouchableOpacity
                key={q}
                style={styles.exampleChip}
                onPress={() => handleSend(q)}
              >
                <ThemedText style={styles.exampleText}>{q}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input bar — marginBottom maintains distance from keyboard using keyboardHeight state */}
      <View style={[styles.inputRow, {
        paddingBottom: keyboardHeight > 0 ? 12 : Math.max(insets.bottom, 12),
        marginBottom: keyboardHeight,
      }]}>
        <TextInput
          style={styles.input}
          placeholder="Ask about Georgia tech careers..."
          placeholderTextColor="#444"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (loading || !input.trim()) && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={loading || !input.trim()}
          activeOpacity={0.75}
        >
          <ThemedText style={styles.sendBtnText}>→</ThemedText>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#151718',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2224',
    backgroundColor: '#151718',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#F5F5F5' },
  headerSub:   { fontSize: 11, color: '#555', marginTop: 3, letterSpacing: 0.2 },
  statusDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E', shadowOpacity: 0.6, shadowRadius: 4,
  },

  // Tier section
  tierSection: {
    backgroundColor: '#151718',
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2224',
  },
  tierSectionLabel: {
    fontSize: 11, color: '#555',
    textTransform: 'uppercase', letterSpacing: 0.5,
    paddingHorizontal: 16, marginBottom: 8,
  },

  // Chat
  chatArea:    { flex: 1, backgroundColor: '#151718' },
  chatContent: { padding: 16, paddingBottom: 24, flexGrow: 1 },

  // Examples
  examplesContainer: { marginTop: 8, gap: 8 },
  examplesLabel: {
    fontSize: 11, color: '#555',
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: 4,
  },
  exampleChip: {
    backgroundColor: '#1A1D1F', borderRadius: 10,
    borderWidth: 1, borderColor: '#2A2D2F',
    paddingHorizontal: 14, paddingVertical: 10,
  },
  exampleText: { fontSize: 13, color: '#60A5FA' },

  // Error
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)', borderRadius: 10,
    padding: 12, marginTop: 8,
  },
  errorText: { fontSize: 13, color: '#F87171', lineHeight: 20 },

  // Input bar 
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1, borderTopColor: '#1E2224',
    backgroundColor: '#151718',
  },
  input: {
    flex: 1, minHeight: 44, maxHeight: 120,
    backgroundColor: '#1A1D1F', borderWidth: 1,
    borderColor: '#2A2D2F', borderRadius: 14,
    paddingHorizontal: 14, paddingTop: 11, paddingBottom: 11,
    fontSize: 15, color: '#F5F5F5', textAlignVertical: 'top',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#1E2224' },
  sendBtnText: { fontSize: 20, color: '#000', fontWeight: '800' },
});