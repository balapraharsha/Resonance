# 🚀 QUICK START GUIDE

## Get Running in 5 Minutes

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure API Key

```bash
cd backend
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
nano .env
```

Get your API key from: https://console.anthropic.com/

### 3. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Open Application

Visit: http://localhost:5173

---

## Need Help?

**Documentation:**
- Full guide: `README.md`
- Deployment: `deploy-aws.sh`
- Demo prep: `demo-script.md`
- Submission: `SUBMISSION.md`

**Common Issues:**
- API not working? Check `.env` has valid `ANTHROPIC_API_KEY`
- Frontend won't build? Run `npm install` again
- Port conflicts? Kill process on port 3001 or 5173

---

## Demo in 3 Steps

1. **Landing** → Click "Begin Your Journey"
2. **Check-in** → Type: "I'm feeling anxious about my career"
3. **Watch** → Matching → Chat → Reflection

**Time**: 3-4 minutes total

---

## 🎯 You're Ready!

Your professional mental health peer support platform is production-ready.

**Key Features:**
✅ Real-time emotional analysis
✅ Smart peer matching
✅ Professional UI/UX
✅ Crisis detection
✅ AWS deployment ready

Good luck winning the hackathon! 🏆
