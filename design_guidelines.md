# Festival Homepage Design Guidelines

## Design Approach
**User-Specified Design System**: This project uses a custom design system provided by the client with specific color palette, typography, and component requirements. The design should follow mobile-first principles with full-viewport poster hero section.

## Core Design Elements

### A. Color Palette

**Grayscale System:**
- white: #FFFFFF
- gray100: #FAFAFA
- gray200: #F0F0F4
- gray300: #D5DADC
- gray400: #C5C8CB
- gray500: #93959D
- gray600: #79777F
- gray700: #4A4A4B
- gray800: #323339
- gray900: #212224
- black: #121212

**Primary Color:**
- modu_red: #FE4A4E

**Gradient:**
- black_grad: Linear gradient from #FFFFFF (64%) to #000000 (80%)

### B. Typography
- **Font Family**: Pretendard (웹폰트 적용)
- **Typography System**: 사용자 제공 타이포 시스템 준수 (attached image reference)
- Hierarchy should support multilingual content (Korean, English, Chinese, Japanese)

### C. Layout System
**Mobile-First Responsive Design:**
- Hero poster section: 100vh (full mobile viewport)
- Consistent spacing using Tailwind primitives: p-4, p-6, p-8, gap-4, gap-6
- Horizontal scroll for gallery and tab navigation
- Sticky navigation tabs after scroll

**Key Layout Sections (순서대로):**
1. Full-viewport festival poster with glassmorphism "AI 상담사와 통화하기" button
2. Language selection buttons (한국어/English/中文/日本語)
3. Festival basic info (name, dates, location, pricing)
4. Divider line
5. Announcements section
6. Sticky horizontal scroll tabs (갤러리/먹거리/위치/프로그램/굿즈)
7. Content sections matching each tab

### D. Component Library

**Glassmorphism Button (Hero Section):**
- Backdrop blur effect
- Semi-transparent background
- Prominent placement over poster image
- No hover/active interactions (default Button component states)

**Language Selector:**
- Four button options: 한국어, English, 中文, 日本語
- Active state indication
- Switches entire page content to selected language

**Horizontal Scroll Tabs:**
- Sticky positioning after scrolling past hero
- Smooth scroll to section on click
- Five tabs: 갤러리, 먹거리 안내, 위치 안내, 프로그램 안내, 굿즈 안내
- Horizontal overflow scrolling on mobile

**Accordion Components:**
- 먹거리 안내: 3 zones (식음존 A, B, C) with restaurant menus and prices
- 프로그램 안내: Date filters (전체, 26일(금), etc.) with program listings
- Each program item includes individual PDF download button

**Gallery:**
- Horizontal scrolling image carousel
- Smooth swipe/scroll behavior
- Responsive image sizing

**PDF Download Buttons:**
- 먹거리 팜플렛 다운로드 (section bottom)
- Individual program 팜플렛 다운로드 (per accordion item)
- 전체 프로그램 타임테이블 다운로드 (section bottom)
- All downloads trigger client-side PDF download of provided file

### E. Functional Requirements

**Multilingual Support:**
- Content switches based on language selection
- Maintain scroll position on language change
- All sections translate including tab labels

**Scroll Behavior:**
- Tabs become sticky after scrolling past announcements
- Tab click triggers smooth scroll to corresponding section
- Maintain natural scrolling throughout

**Download Functionality:**
- Implement client-side PDF download
- Use provided PDF file as download source
- Clear visual feedback on download action

## Images
- **Hero Image**: Full-viewport festival poster (100vh on mobile) - user will provide actual festival poster image
- **Gallery Images**: Multiple festival photos for horizontal scrolling gallery section
- **Section Graphics**: Optional supporting images for each content section

## Mobile Optimization Priority
- Hero poster must fill entire mobile viewport (100vh)
- Touch-friendly button sizes and tap targets
- Horizontal scroll areas with momentum scrolling
- Optimized for Korean mobile devices
- Fast loading with web font optimization