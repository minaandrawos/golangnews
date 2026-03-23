# GolangNews — Post-Modernization Improvement Plan

## Context

The SDK 34 → SDK 54 modernization is **complete** (documented in `_archive/docs/MODERNIZATION_PLAN.md`). The app now runs on React 19, React Navigation v6, with functional components, hooks, dark/light theming, and full platform support (Android, iOS, web).

The original 7 post-modernization issues are now fully resolved. A subsequent security and Play Store review identified additional items, documented in Priority 4 below.

---

## Priority 1 — 🔴 Bug Fix (Breaks Core Navigation) — ✅ COMPLETE

### Fix Android BackHandler Conflict in FeedScreen

**Problem:** `FeedScreen.js` uses `useEffect` to register the hardware back button handler. Because React Navigation keeps FeedScreen mounted when navigating to ArticleScreen, this handler stays active while ArticleScreen is in focus. On Android, pressing Back on the article page may trigger FeedScreen's tag-history navigation instead of closing the article.

**Fix:** Replace `useEffect` with `useFocusEffect` (already used correctly in ArticleScreen, available from `@react-navigation/native`) so the handler is only active when FeedScreen is focused.

**File:** `src/screens/FeedScreen.js`

**Checklist:**
- [x] Import `useFocusEffect` from `@react-navigation/native` in FeedScreen.js
- [x] Wrap the BackHandler `addEventListener` / `remove` logic in `useFocusEffect(useCallback(...))` instead of `useEffect`
- [ ] Verify: navigate Feed → Article → press Back → returns to Feed list (not navigating tags)
- [ ] Verify: press Back on Feed with tag history → navigates tag history correctly
- [ ] Verify: press Back on Feed with no tag history → exits app (Android)

---

## Priority 2 — 🟡 Medium (UI/UX Integrity) — ✅ COMPLETE

### 2a. Centralize StatusBar Management — ✅ DONE

**Problem:** Three files manage StatusBar using different APIs — `App.js` uses `expo-status-bar`, `FeedScreen.js` and `ArticleScreen.js` use `react-native`'s `StatusBar`. This causes potential flickering and conflicts during screen transitions.

**Fix:** Remove StatusBar from both screens. Manage it in a single place — `App.js` — using `expo-status-bar`'s `<StatusBar style="auto" />` which adapts to the active theme automatically.

**Files:** `App.js`, `src/screens/FeedScreen.js`, `src/screens/ArticleScreen.js`

**Checklist:**
- [x] Remove `StatusBar` import and usage from `FeedScreen.js`
- [x] Remove `StatusBar` import and usage from `ArticleScreen.js`
- [x] Confirm `App.js` has `<StatusBar style="auto" />` from `expo-status-bar`
- [ ] Test: status bar text is light on dark header and dark on light header in both screens

---

### 2b. Fix Hardcoded Dark Theme in ErrorBoundary — ✅ DONE

**Problem:** `App.js` has a class-based `ErrorBoundary` with hardcoded dark colors (`#0D1117` background, `#F85149` text). In light mode, a crash renders a jarring dark screen.

**Fix:** Move `<ErrorBoundary>` inside `ThemeProvider` in the component tree so it can access theme colors. Since class components can't use hooks, use a functional inner component for the fallback render that calls `useTheme()`.

**File:** `App.js`

**Checklist:**
- [x] Move `<ErrorBoundary>` to wrap only the navigation tree (inside `ThemeProvider`, not outside it)
- [x] Replace hardcoded colors in ErrorBoundary fallback render with a functional sub-component (`ErrorFallback`) using `useTheme()`
- [ ] Test: trigger error in light mode → error screen uses light colors

---

### 2c. Auto-Scroll Active CategoryTab into View — ✅ DONE

**Problem:** `CategoryTabs.js` has a `scrollRef` on the ScrollView that is created but never used. When a category off-screen (e.g., "Podcasts", "Show") is selected programmatically via tag press, the tab bar doesn't scroll to show the active pill.

**Fix:** Use `scrollRef` to call `scrollTo()` when the selected category changes. Track each tab's x-offset via `onLayout` callbacks and scroll to the matching offset on selection change.

**File:** `src/components/CategoryTabs.js`

**Checklist:**
- [x] Add a `tabOffsets` ref (`useRef({})`) to store x-position of each tab via `onLayout`
- [x] Add a `useEffect` that watches `selectedCategory` and calls `scrollRef.current?.scrollTo({ x: tabOffsets.current[category], animated: true })` when it changes
- [ ] Test: select "Show" or "Podcasts" via tag press → tab bar scrolls to show the active tab

---

## Priority 3 — 🟢 Low (Maintenance & Polish)

### 3a. Delete Legacy Dead Code — ✅ DONE

**Problem:** `feed.js`, `pageview.js`, `gnmenu.js`, and `styles.js` in the repo root are the original 2019 class-based codebase. They are not imported by anything but clutter the root directory.

**Files:** `feed.js`, `pageview.js`, `gnmenu.js`, `styles.js` (root level)

**Checklist:**
- [x] Confirm none of these are imported anywhere
- [x] Delete `feed.js`, `pageview.js`, `gnmenu.js`, `styles.js` from root
- [x] Run `npm test` to confirm nothing broke

---

### 3b. Extract Shared Title Parsing to a Utility — ✅ DONE

**Problem:** Both `NewsCard.js` and `ArticleScreen.js` implement identical logic to strip hashtags from article titles. If the format changes, both files need to be updated.

**Fix:** Create `src/utils.js` with shared utility functions. Move `parseTitle()`, `getDomain()`, and `getRelativeDate()` there and import from both files.

**Files:** `src/utils.js` (new), `src/components/NewsCard.js`, `src/screens/ArticleScreen.js`

**Checklist:**
- [x] Create `src/utils.js` with `parseTitle(rawTitle)`, `getDomain(link)`, `getRelativeDate(published)` exported
- [x] Update `NewsCard.js` to import from `../utils` instead of defining them locally
- [x] Update `ArticleScreen.js` to import `parseTitle` from `../utils` instead of its inline regex
- [x] Run `npm test` to confirm no regressions

---

### 3c. Remove Redundant Theme Calculation in App.js — ✅ DONE

**Problem:** `App.js` manually calculates `isDark` and derives colors using `useColorScheme()`, duplicating what `ThemeContext` already does.

**Fix:** Exposed `isDark` from `ThemeContext` via a new `useIsDark()` hook (context stores `{ colors, isDark }`; `useTheme()` returns `colors` unchanged). `AppNavigator` now calls `useIsDark()` instead of `useColorScheme()`. `useColorScheme` import removed from `App.js`.

**Files:** `src/context/ThemeContext.js`, `App.js`

**Checklist:**
- [x] Expose `isDark` from `ThemeContext` via new `useIsDark()` hook
- [x] Remove `useColorScheme()` / `isDark` from `AppNavigator` and source `isDark` from `useIsDark()`
- [x] Confirm no visual change — navigation header colors remain correct

---

### 3d. Improve Empty & Error States — ✅ DONE

**Problem:** Error and empty states in `FeedScreen.js` are text-only with no visual weight.

**Fix:** Add Ionicons icons above the message text for both states.

**File:** `src/screens/FeedScreen.js`

**Checklist:**
- [x] Add `Ionicons` import (already available via `@expo/vector-icons`)
- [x] Add `cloud-offline-outline` icon above error message text
- [x] Add `newspaper-outline` icon above empty state text
- [x] Confirm icons respect theme colors

---

## Priority 4 — 🔒 Security & Play Store Hardening — ⚠️ PARTIALLY DONE

Identified during pre-submission security review and Google Play policy audit (March 2026).

### 4a. Android Manifest — Remove Dev Permissions — ✅ DONE

**Problem:** `AndroidManifest.xml` contained four permissions left over from the React Native dev toolchain that must not ship in production: `SYSTEM_ALERT_WINDOW` (dev error overlay), `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `VIBRATE`. Also had `allowBackup="true"`.

**Fix:** Removed all four unnecessary permissions. Set `allowBackup="false"`.

**File:** `android/app/src/main/AndroidManifest.xml`

**Checklist:**
- [x] Remove `SYSTEM_ALERT_WINDOW`
- [x] Remove `READ_EXTERNAL_STORAGE`
- [x] Remove `WRITE_EXTERNAL_STORAGE`
- [x] Remove `VIBRATE`
- [x] Set `android:allowBackup="false"`

---

### 4b. Tag URL Encoding Bug — ✅ DONE

**Problem:** Tags extracted from RSS titles were appended to the query URL without `encodeURIComponent`. A tag containing `&`, `+`, `=`, or other special characters would corrupt the query string sent to golangnews.com (e.g. `#go&python` → broken URL).

**Fix:** Wrap tag in `encodeURIComponent()` before concatenation.

**File:** `src/components/NewsCard.js`

**Checklist:**
- [x] Apply `encodeURIComponent(tag)` in tag `onPress` handler
- [x] `npm test` passes

---

### 4c. WebView Origin Whitelist — ✅ DONE

**Problem:** `originWhitelist` was not explicitly set on the WebView, relying on the default. Best practice is to declare it explicitly to make intent clear and guard against any future default changes.

**Fix:** Added `originWhitelist={['https://*', 'http://*']}` to the WebView in `ArticleScreen.js`.

**File:** `src/screens/ArticleScreen.js`

**Checklist:**
- [x] Add `originWhitelist` prop to WebView

---

### 4d. Release Signing — ⚠️ MANUAL ACTION REQUIRED

**Problem:** `android/app/build.gradle` line 115 configures the release build type to use the debug keystore (`signingConfig signingConfigs.debug`). Submitting to Play Store with the debug key is not permitted.

**Fix:** Generate a production keystore and update `build.gradle` with a `release` signing config pointing to it.

**File:** `android/app/build.gradle`

**Checklist:**
- [ ] Generate production keystore: `keytool -genkey -v -keystore gonews-release.keystore -alias gonews -keyalg RSA -keysize 2048 -validity 10000`
- [ ] Store keystore file securely (do NOT commit to git)
- [ ] Add `release` signing config in `build.gradle` pointing to production keystore
- [ ] Reference: https://reactnative.dev/docs/signed-apk-android

---

### 4e. Google Play Policy Compliance — ⚠️ MANUAL ACTION REQUIRED

The following Play Store policies were reviewed:

| Policy | Requirement | Status |
|---|---|---|
| Data Safety (answer/10787469) | Fill out Data Safety form in Play Console; link privacy policy | Manual step — form not yet submitted |
| News/Magazine apps (answer/10523915) | Privacy policy in place; editorial sourcing transparent | Privacy policy exists at `docs/privacy-policy.html` ✅ |
| Financial features (answer/13849271) | Declare if app has financial features | Not applicable ✅ |
| Health apps (answer/14738291) | Declare if app has health features | Not applicable ✅ |

**Checklist:**
- [ ] In Play Console → App content → Data safety: declare "No data collected", link privacy policy URL
- [x] Privacy policy published and linked in-app

---

## Verification

After all fixes:

```bash
npm test                        # all tests pass
npx expo start --web            # web: feed loads, articles open new tab, status bar correct
npx expo run:android            # Android: back button works correctly on feed + article
npx expo run:ios                # iOS: no visual regressions
adb shell cmd uimode night yes  # dark mode: ErrorBoundary, status bar, all screens correct
adb shell cmd uimode night no   # light mode: same check
```

---

## File Map

| File | Changes |
|---|---|
| `src/screens/FeedScreen.js` | useEffect → useFocusEffect for BackHandler; remove StatusBar; add icons to empty/error states |
| `src/screens/ArticleScreen.js` | Remove StatusBar; import parseTitle from utils; add WebView originWhitelist |
| `src/components/CategoryTabs.js` | Add onLayout tracking + scrollTo on selection change |
| `src/components/NewsCard.js` | Import getDomain, getRelativeDate, parseTitle from utils; encodeURIComponent on tag URLs |
| `src/context/ThemeContext.js` | Expose isDark via useIsDark() hook |
| `App.js` | Move ErrorBoundary inside ThemeProvider; remove useColorScheme/isDark (use useIsDark()); centralize StatusBar |
| `src/utils.js` | NEW — shared utility functions |
| `android/app/src/main/AndroidManifest.xml` | Remove dev permissions; set allowBackup=false |
| `feed.js`, `pageview.js`, `gnmenu.js`, `styles.js` | DELETED |
