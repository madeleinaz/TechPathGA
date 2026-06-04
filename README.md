# TechPathGA

A mobile career platform built for Georgia students and job seekers exploring tech careers. Covers employers, universities, certifications, and Georgia-specific programs — with an AI advisor backed by live web search.

## Screens

### Home
- Hero section with Georgia tech market stats (6+ employers, $65K+ avg entry pay, 10+ certifications, free state programs)
- Feature cards linking to each section
- Georgia Spotlight: Quick Start, HOPE Career Grant, Augusta Cyber Center, Atlanta Tech Square
- AI Advisor CTA

### Tech Careers
- Job listings from Delta, Google, Equifax, Home Depot, NCR Voyix, and Fiserv
- Company filter bar — tap a chip to filter and auto-scroll to that company's listings
- Expandable job cards showing salary range, location, level badge (Entry/Mid/Senior), skill tags, full description, and requirements

### Education Paths
- Georgia universities with CS programs: Georgia Tech, UGA, KSU, GSU, Augusta University
- Degree options, transfer paths, and program details

### Certifications
- Certifications and bootcamps ranked by Georgia employer demand
- Includes AWS, CompTIA Security+, Cisco CCNA, and others

### AI Advisor
- Conversational AI powered by OpenAI with live web search
- Georgia-specific system prompt — advice tailored to the Atlanta/Georgia job market
- Experience tier selector (Beginner, Career Changer, Experienced Pro)
- Example query chips for common questions

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | React Native, Expo (SDK 54) |
| Language | TypeScript |
| Navigation | Expo Router (file-based tabs) |
| AI | OpenAI API with live web search (Responses API) |
| Styling | Custom theme, StyleSheet |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Start the app:
   ```bash
   npx expo start
   ```
