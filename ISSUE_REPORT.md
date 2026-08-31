# NeuroNest Application - Comprehensive Issue Report
**Generated:** 2026-08-31

---

## 🔴 CRITICAL ISSUES

### 1. Missing Environment Variables - ElevenLabs Voice Service
**File:** `src/services/VoiceService.js` (lines 34, 92)  
**Severity:** HIGH  
**Issue:** Missing ElevenLabs API credentials cause the app to fall back to browser's Web Speech API  
**Console Warning:** "Missing ElevenLabs env vars. Falling back to browser voice."  
**Impact:** 
- Voice quality is degraded
- No premium voice features available
- Warning pollutes console on every voice action (appears 3x on page load alone)

**Fix:** Either provide env vars or suppress console warning if fallback is intentional

---

### 2. Global Mutable State in Voice Chat
**File:** `src/pages/patient/mic_chat.tsx` (lines 11-12)  
**Severity:** MEDIUM  
**Issue:** Uses global `let` variables instead of React state
```javascript
let currentUtterance: SpeechSynthesisUtterance | null = null;
let textClearTimeout: number | undefined;
```
**Problems:**
- Could cause issues with multiple component instances
- Memory leak if timeouts aren't cleared properly
- Not thread-safe
- Difficult to debug state changes

---

### 3. GuideProvider Commented Out (Dead Code)
**File:** `src/App.tsx` (line 10)  
**Severity:** MEDIUM  
**Issue:** Core feature disabled but still has implementation
```javascript
// import GuideProvider from './guide/GuideProvider'; // Commented out for now
```
**Problems:**
- Entire guide/spotlight system is non-functional
- Code maintenance burden
- Unclear why it's disabled or if it will be re-enabled

---

### 4. Hardcoded Language in Voice Service
**File:** `src/services/VoiceService.js` (line 125) & `src/pages/patient/mic_chat.tsx` (line 26)  
**Severity:** MEDIUM  
**Issue:** Speech recognition language hardcoded to `'en-US'` despite app supporting multiple languages
```javascript
recognition.lang = 'en-US'; // Should use i18n.language
```
**Supported Languages:** Assamese (as), English (en), Spanish (es), Hindi (hi)  
**Impact:** 
- Voice commands only work in English
- Inconsistent UX for non-English users
- Speech recognition accuracy poor for other languages

---

## ⚠️ HIGH-PRIORITY ISSUES

### 5. Unhandled Promise Rejections
**File:** `src/services/VoiceService.js` (lines 70-97)  
**Severity:** HIGH  
**Issue:** Audio playback can fail with no error handling
```javascript
audio.play().catch(() => onDone()); // Silently fails
```
**Problems:**
- Users won't know if audio failed to play
- Promise rejection not properly handled in all error paths

---

### 6. Incomplete Feature - Screen Time Cap
**File:** `src/providers/CareProvider.jsx` (lines 117-123)  
**Severity:** MEDIUM  
**Issue:** TODO comment indicates incomplete implementation
```javascript
// TODO: enforce 1-2hr daily screen time cap — needs a decision on: 
// is this wall-clock time since first app open today, or only time spent in active tasks...
```
**Problems:**
- Feature listed but not implemented
- No enforcement mechanism
- Could mislead users about app capabilities

---

### 7. Incomplete Feature - Unconfirmed Target Screen
**File:** `src/pages/patient/HomePage.tsx` (line 259)  
**Severity:** LOW  
**Issue:** TODO indicates uncertain feature requirements
```javascript
{/* TODO: target screen not yet confirmed, ask before scripting. */}
```

---

### 8. Race Condition in GuideProvider
**File:** `src/guide/GuideProvider.jsx` (lines 65-78)  
**Severity:** MEDIUM  
**Issue:** Voice playback timing conflicts with microphone listening  
**Context:** From repo memory, timing buffers were added but issue may not be fully resolved

---

## 🟠 ACCESSIBILITY & UX ISSUES

### 9. Missing Error Boundaries
**File:** `src/App.tsx`  
**Severity:** MEDIUM  
**Issue:** No React Error Boundary component to catch rendering errors  
**Impact:** Single error crashes entire app with no fallback UI

---

### 10. Inconsistent Error Handling
**File:** `src/pages/patient/HomePage.tsx` (line 29)  
**Severity:** MEDIUM  
**Issue:** Try-catch block with only console.error logging
```javascript
if (savedUser) {
  try {
    const u = JSON.parse(savedUser);
    if (u.name) setUserName(u.name);
  } catch (e) {
    console.error(e); // User never sees this
  }
}
```
**Problems:**
- User never informed of parsing failure
- Silent failures hard to debug
- No fallback default value guaranteed

---

### 11. Speech Recognition Not Supported - No User Feedback
**File:** `src/services/VoiceService.js` (line 117)  
**Severity:** MEDIUM  
**Issue:** Only console warning when speech recognition unavailable
```javascript
if (!SpeechRecognition) {
  console.warn('Speech recognition is not supported in this browser.');
```
**Problems:**
- Users with unsupported browsers get confusing behavior
- Microphone button exists but silently fails
- No UI indication of unsupported feature

---

### 12. Firestore Offline Persistence Silent Failure
**File:** `src/services/firebase.ts` (line 28)  
**Severity:** MEDIUM  
**Issue:** Only logs warning if offline persistence fails
```javascript
enableIndexedDbPersistence(db).catch((err) => {
  console.warn('Firestore offline persistence not enabled:', err.code)
})
```
**Problems:**
- App may have inconsistent behavior offline
- Failure silently ignored
- No fallback mechanism

---

### 13. Missing Loading States
**File:** Multiple pages  
**Severity:** LOW-MEDIUM  
**Issue:** No loading skeletons or spinners during async operations  
**Affects:**
- Voice service speaking
- Firestore queries
- Navigation between pages

---

### 14. Toast Message Auto-Dismiss Too Quick
**File:** `src/components/Toast.tsx` (line 23)  
**Severity:** LOW  
**Issue:** Messages disappear after 3.2 seconds
```javascript
const timer = window.setTimeout(() => setToast(null), 3200)
```
**Problem:** May be too fast for users to read, especially with voice commands

---

### 15. Voice Status Text Unclear
**File:** `src/components/CheckInOverlay.jsx`  
**Severity:** LOW  
**Issue:** Overlay text "Just checking in... Listening for your answer" could be confusing  
**Better:** "Listening... Please speak now" or show visual mic indicator

---

### 16. No Focus/Hover States
**File:** `src/index.css` & various component styles  
**Severity:** MEDIUM  
**Issue:** Interactive elements missing visual feedback on desktop  
**Affects:** All buttons lack `:hover` and `:focus` states  
**Problems:**
- Unclear which elements are clickable
- Accessibility issue for keyboard navigation
- Desktop users get poor UX

---

### 17. Emergency Button Color Contrast
**File:** `src/pages/patient/HomePage.tsx` (line 285)  
**Severity:** MEDIUM  
**Issue:** SOS button may have contrast issues
**Current:** Red (#B33F33) button on green (#3F6B4F) background  
**Problem:** May not meet WCAG color contrast requirements

---

### 18. Profile Image Placeholder Issues
**File:** `src/pages/patient/HomePage.tsx` (lines 272-273)  
**Severity:** LOW  
**Issue:** Images hidden on error with `display: 'none'` - no fallback shown
```javascript
onError={(e) => (e.currentTarget.style.display = 'none')}
```
**Better:** Show default avatar or initials

---

## 🐛 CODE QUALITY ISSUES

### 19. Memory Leak in Voice Service
**File:** `src/services/VoiceService.js` (lines 70-78)  
**Severity:** MEDIUM  
**Issue:** Object URLs not cleaned up on all error paths
```javascript
const onDone = () => {
  audio.removeEventListener('ended', onDone);
  audio.removeEventListener('error', onDone);
  publishVoiceStatus({ phase: 'idle', text: '' });
  URL.revokeObjectURL(audioUrl); // Only cleaned up on success path
  resolve();
};
```

---

### 20. Missing Null Checks
**File:** Multiple files  
**Severity:** MEDIUM  
**Issues Found:**
- `src/guide/GuideProvider.jsx` line 83: No check if `navigate` succeeds
- `src/providers/CareProvider.jsx` line 52: `scheduledTask?.taskName` - task might be null
- Response handling without null checks in various API calls

---

### 21. No Route Validation Before Navigation
**File:** `src/guide/GuideProvider.jsx` (lines 83-85)  
**Severity:** LOW  
**Issue:** Navigates to routes without checking if they exist
```javascript
if (selected?.route) {
  navigate(selected.route); // Route might not exist
}
```

---

### 22. Inconsistent TypeScript Usage
**Files:** Mix of `.ts`, `.tsx`, `.js`, `.jsx`  
**Severity:** LOW  
**Issue:** 
- `src/services/VoiceService.js` - JavaScript in TypeScript project
- `src/pages/patient/mic_chat.tsx` - TypeScript with type annotations mixed with any types
- Inconsistent type definitions

**Better:** Enforce strict TypeScript across codebase

---

### 23. Hardcoded Timeouts Without Documentation
**File:** `src/guide/GuideProvider.jsx`, `src/services/VoiceService.js`  
**Severity:** LOW  
**Issues:**
- 3000ms pause after speaking (line 68) - why this duration?
- 30000ms listen timeout (line 30) - why this duration?
- 6000ms check-in timeout (line 86 in CareProvider) - inconsistent with other timeouts
- No constants defined for these magic numbers

---

## 📱 VISUAL/UI ISSUES

### 24. No Mobile Responsiveness Indicators
**File:** `src/pages/patient/HomePage.tsx` (line 66)  
**Severity:** LOW  
**Issue:** Phone mockup hardcoded to 410px max-width
**Problems:**
- Ugly on very large desktop screens (empty space)
- Ugly on very small screens (<380px)
- No tablet layout

---

### 25. No Animation Feedback
**File:** Entire app  
**Severity:** LOW  
**Issue:** Missing transitions between page changes  
**Better:** Add fade-in/slide transitions for better UX

---

### 26. Settings Button Icon Not Labeled
**File:** `src/pages/patient/HomePage.tsx` (line 107)  
**Severity:** LOW  
**Issue:** Gear icon has no label text  
**Better:** Add aria-label and title attribute

---

### 27. Language Switcher Position
**File:** `src/pages/patient/HomePage.tsx` (lines 106-110)  
**Severity:** LOW  
**Issue:** Positioned next to greeting, could overlap on small screens  
**Current:** Absolute positioning may cause layout issues

---

### 28. No Scroll Indicators
**File:** `src/pages/patient/HomePage.tsx` (line 81)  
**Severity:** LOW  
**Issue:** Scrollable content area has no visual indicator  
**Better:** Add subtle scrollbar or scroll shadows

---

### 29. Missing Micro-Interactions
**File:** Throughout app  
**Severity:** LOW  
**Issue:** Buttons lack press feedback/ripple effects  
**Examples:**
- No button active state when clicked
- No haptic feedback on mobile
- No visual confirmation of action completion

---

## 📊 SUMMARY TABLE

| Category | Count | Priority |
|----------|-------|----------|
| Critical Issues | 4 | 🔴 |
| High Priority | 2 | 🟠 |
| Medium Priority | 10 | ⚠️ |
| Low Priority | 13 | 🟡 |
| **Total** | **29** | - |

---

## ✅ RECOMMENDATIONS

### Immediate Fixes (Next Sprint)
1. Add error boundaries to prevent app crashes
2. Fix language hardcoding in voice service (use i18n)
3. Remove commented GuideProvider or re-enable it
4. Add proper error UI for failed operations
5. Add focus/hover states to all interactive elements

### Short-term Improvements (2-3 Sprints)
1. Implement screen time cap feature
2. Add loading states and skeletons
3. Fix speech recognition unsupported browser handling
4. Add error logging/monitoring service
5. Refactor global state to use React hooks properly

### Long-term Improvements
1. Add comprehensive testing (unit + e2e)
2. Accessibility audit and WCAG compliance
3. Performance optimization
4. User analytics integration
5. Offline-first data sync improvements

---

**Report Generated By:** GitHub Copilot  
**Last Updated:** 2026-08-31
