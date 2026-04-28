#!/bin/bash

# Resonance Testing & Demo Preparation Script

set -e

echo "🧪 Resonance Testing & Demo Prep"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the resonance directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Please run this script from the resonance root directory${NC}"
    exit 1
fi

echo "✅ Running from correct directory"
echo ""

# Test 1: Check dependencies
echo "Test 1: Checking dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi
echo -e "${GREEN}✅ Frontend dependencies OK${NC}"

cd ../backend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi
echo -e "${GREEN}✅ Backend dependencies OK${NC}"
cd ..

# Test 2: Check environment variables
echo ""
echo "Test 2: Checking environment configuration..."
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${RED}❌ Please edit backend/.env and add your ANTHROPIC_API_KEY${NC}"
    echo "   Get your key from: https://console.anthropic.com/"
    exit 1
fi

if grep -q "your_api_key_here" backend/.env; then
    echo -e "${RED}❌ Please update ANTHROPIC_API_KEY in backend/.env${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment configuration OK${NC}"

# Test 3: Build frontend
echo ""
echo "Test 3: Building frontend..."
cd frontend
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend builds successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
cd ..

# Test 4: Start backend and test API
echo ""
echo "Test 4: Testing backend API..."
cd backend
node server.js &
BACKEND_PID=$!
sleep 3

# Test health endpoint
HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health)
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend API health check passed${NC}"
else
    echo -e "${RED}❌ Backend API health check failed${NC}"
    kill $BACKEND_PID
    exit 1
fi

# Test emotional analysis endpoint
echo "Testing emotional analysis..."
EMOTION_RESPONSE=$(curl -s -X POST http://localhost:3001/api/analyze-emotion \
    -H "Content-Type: application/json" \
    -d '{"input": "I am feeling anxious about my career and future"}')

if echo "$EMOTION_RESPONSE" | grep -q "emotionalState"; then
    echo -e "${GREEN}✅ Emotional analysis endpoint working${NC}"
else
    echo -e "${RED}❌ Emotional analysis endpoint failed${NC}"
    echo "Response: $EMOTION_RESPONSE"
    kill $BACKEND_PID
    exit 1
fi

kill $BACKEND_PID
cd ..

# Test 5: Create demo data
echo ""
echo "Test 5: Preparing demo data..."
cat > demo-script.md << 'EOF'
# Resonance Demo Script

## Opening (30 seconds)
"At 2 AM, when you're spiraling, therapy isn't available. Crisis hotlines have 2-hour waits. But millions of others are awake right now, also struggling. The solution isn't more AI chatbots—it's connecting these humans at exactly the right emotional moment."

## Demo Flow (3-4 minutes)

### 1. Landing Page (10 sec)
- Show professional design
- Highlight three value props: Anonymous & Safe, Human Connection, AI-Matched

### 2. Emotional Check-In (30 sec)
**Input:** "I'm feeling really anxious about my career. I don't know what path to take and it's keeping me up at night. Everyone else seems to have it figured out."

- Show voice input option
- Demonstrate typing
- Click "Continue"

### 3. Matching Animation (15 sec)
- Show loading states:
  - "Analyzing your emotional state..."
  - "Finding someone who understands..."
  - "Matching emotional proximity..."
  - "Connection established"
- Persona reveals: "Graduate student who navigated career uncertainty"

### 4. Chat Interface (90 sec)
Show 4-5 message exchanges:

**Peer:** "I understand how overwhelming career decisions can feel..."

**You:** "It's like everyone knows what they're doing except me"

**Peer:** "I felt exactly that way last year. The comparison trap is real. What matters most to you in a career?"

**You:** "I want to make an impact, but I'm scared of making the wrong choice"

**Peer:** "That fear actually shows you care. Have you considered that there might not be one 'right' choice?"

- Point out 15-minute timer
- Show anonymous indicator
- Highlight safety disclaimer

### 5. Reflection Screen (30 sec)
- Show emotional check-out slider (moved from 4/10 to 7/10)
- Display reflection prompt
- Show professional resources

## Key Points to Emphasize

### Innovation (Why This Wins "Most Innovative")
"This isn't another AI chatbot for mental health. We're using AI as a **connector, not a replacement**. Claude routes human empathy to where it's needed most."

### Technical Excellence
- Real-time emotional analysis
- Smart persona matching
- Professional UI/UX
- Crisis detection system
- Working prototype (not a mockup)

### Ethical Alignment (Track 2's Key Question)
**"What can AI therapy do, and what can it absolutely not replace?"**

**Our answer:**
- AI CANNOT replace human empathy and connection
- AI CAN route that empathy instantly, accurately, and safely
- We built guardrails:
  - Crisis detection → immediate professional resources
  - Time-bounded conversations (15 min)
  - Anonymous by default
  - Clear disclaimers
  - Report/exit options always visible

### Impact Potential
- **Specific problem:** People need support NOW, not next Tuesday
- **Specific population:** Anyone experiencing emotional distress, especially at odd hours
- **Clear benefit:** Immediate peer support that scales infinitely
- **Real-world application:** Launch as student mental health resource

## Q&A Preparation

**Q: How is this different from crisis hotlines?**
A: We're not replacing crisis hotlines—we complement them. For people in struggling (not crisis) who need someone to talk to, not professional intervention.

**Q: What if someone gives bad advice?**
A: Conversations are peer support, not advice. We use AI to guide toward empathy, not solutions. Plus real-time moderation flags harmful content.

**Q: How do you prevent abuse?**
A: Multiple layers: anonymous matching, time limits, content moderation, easy report/exit, and crisis detection that redirects to professionals.

**Q: Can this scale?**
A: Yes - it's peer-to-peer. As more people join, more support becomes available. The bottleneck isn't therapists, it's matching.

**Q: What about data privacy?**
A: Zero data retention. Conversations are analyzed in real-time for safety but never stored. Complete anonymity.

## Closing (15 seconds)
"Resonance proves that AI doesn't have to replace human connection—it can facilitate it. At 2 AM, when someone needs to feel less alone, we make that possible. That's the future of mental health support."

---

## Demo Checklist

- [ ] Backend running on localhost:3001
- [ ] Frontend running on localhost:5173
- [ ] .env configured with API key
- [ ] Browser window ready
- [ ] Demo data prepared
- [ ] Slides/notes accessible
- [ ] Backup video recording ready
- [ ] Timer set for 5 minutes
EOF

echo -e "${GREEN}✅ Demo script created (demo-script.md)${NC}"

# Test 6: Create backup demo video instructions
echo ""
echo "Test 6: Creating backup instructions..."
cat > backup-demo.md << 'EOF'
# Backup Demo Instructions

## If Live Demo Fails

1. **Have screen recording ready:**
   - Record full demo flow beforehand
   - 4K quality, clear audio
   - 3-4 minutes max

2. **Screenshots for each stage:**
   - Landing page
   - Emotional check-in
   - Matching animation
   - Chat interface (with messages)
   - Reflection screen

3. **Fallback talking points:**
   - Focus on the innovation
   - Walk through screenshots
   - Emphasize ethical considerations
   - Highlight technical architecture

## Recording Your Demo Video

```bash
# macOS
# Use QuickTime Screen Recording (Cmd+Shift+5)

# Linux
# Use OBS Studio or SimpleScreenRecorder

# Windows
# Use OBS Studio or Windows Game Bar (Win+G)
```

## What to Record

1. Open application
2. Click "Begin Your Journey"
3. Type demo input (slowly, clearly visible)
4. Show matching animation (wait for complete cycle)
5. Show chat with 3-4 messages
6. End chat
7. Show reflection screen

Save as: `resonance-demo.mp4`
EOF

echo -e "${GREEN}✅ Backup demo instructions created (backup-demo.md)${NC}"

# Summary
echo ""
echo "================================"
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start Development Servers:"
echo "   Terminal 1: cd backend && npm start"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "2. Open browser to: http://localhost:5173"
echo ""
echo "3. Review demo script: cat demo-script.md"
echo ""
echo "4. Practice demo flow 3-5 times"
echo ""
echo "5. Record backup video (see backup-demo.md)"
echo ""
echo "6. Deploy to AWS (when ready): ./deploy-aws.sh"
echo ""
echo "🎯 You're ready to win this hackathon!"
echo ""
