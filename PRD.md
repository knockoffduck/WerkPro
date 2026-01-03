# Product Requirements Document (PRD): WerkPro
**Version:** 1.0
**Status:** Development

## 1. Product Overview
**WerkPro** is a high-performance, offline-first mobile workout tracker built on React Native. It mimics the "Pro" features of industry leaders (like Strong App), focusing on speed, data density, and friction-free logging.
* **Core Value:** Rapid data entry via a custom keyboard, advanced analytics (1RM/Volume), and unlimited template management.
* **Platform:** iOS & Android (via Expo Go/Prebuild).

### Tech Stack
* **Framework:** React Native (Expo SDK 50+) via **Expo Router**.
* **Language:** TypeScript (Strict Mode).
* **Styling:** NativeWind (Tailwind CSS for React Native).
* **Icons:** `lucide-react-native`.
* **State Management:**
    * *Global/Server State:* TanStack Query (React Query).
    * *Local/Session State:* Zustand (for active workout data).
* **Local Storage:** `@react-native-async-storage/async-storage` (Persistence).
* **Database & Auth:** Appwrite.
* **Performance:** `@shopify/flash-list` (for large lists).
* **Charts:** `react-native-gifted-charts`.

---

## 2. File Structure (Expo Router)
The project must follow a strict file-based routing architecture.

```text
/app
  /(auth)
    login.tsx
    signup.tsx
  /(tabs)
    _layout.tsx            # Bottom Tab Navigator
    index.tsx              # Redirects to /profile or /workout
    profile.tsx            # Dashboard/Stats
    history.tsx            # Calendar/Log List
    start-workout.tsx      # Central Hub (Templates)
    exercises.tsx          # Library
    measure.tsx            # Body stats
  /workout
    [id].tsx               # The Active Workout Screen (Modal)
  _layout.tsx              # Root Provider (QueryClient, AuthProvider)
  +not-found.tsx
/components
  /ui                      # Primitives (Button, Card, Input)
  /active-workout          # Complex: SetRow, RestTimer, PlateCalculator
  /keyboard                # The CustomNumberPad component
  /charts                  # Analytics wrappers
/constants
  Colors.ts
  Layout.ts
/hooks
  useWorkoutTimer.ts
  usePlateMath.ts
/lib
  appwrite.ts              # Appwrite Client & Config
  storage.ts               # AsyncStorage wrapper
/store
  workoutStore.ts          # Zustand: handles "in-progress" workout state
/types
  index.ts                 # Database & App Interfaces

```
## 3. Naming Conventions
Folders: kebab-case (e.g., components/active-workout).

Files: kebab-case for routes (app/start-workout.tsx), PascalCase for Components (components/ui/Button.tsx).

Functions/Variables: camelCase (e.g., calculateOneRepMax, isTimerRunning).

Interfaces: PascalCase (e.g., Exercise, WorkoutSession).

Appwrite Collections: snake_case (e.g., workout_logs).

## 4. UI Design System 
Visual Style: "Pro" Utility—High contrast, minimal clutter, optimized for OLED displays.

Theme: Dark Mode Only (Default).

Color Palette:

Background: #000000 (Main), #1C1C1E (Cards/Modals).

Primary: #007AFF (Electric Blue) - Used for "Finish Set", "Start Workout", Active Tab.

Text: #FFFFFF (Headings), #A1A1AA (Subtext/Muted).

Error: #EF4444.

Success: #22C55E.

Typography: System Sans-Serif. Large, legible numbers for sets/reps.

## 5. Key Features & User Flows
A. The Custom Keyboard (Critical)

Problem: System keyboards are clunky for rapid numeric entry.

Solution: A persistent CustomNumberPad component anchored to the bottom of the Active Workout screen.

Behavior:

Clicking a weight/rep input field does NOT open the iOS/Android keyboard.

Instead, it focuses the field and input flows from the custom pad.

Keys: 1-9, 0, ., Backspace, Next (jumps to reps or next set), Hide.

B. Active Workout Session (The Core Loop)

Initialization: User selects a Template -> App creates a Zustand session -> Navigates to /workout/[id].

Set Logging:

Renders list of Exercises.

Each Exercise has a list of SetRow components.

SetRow columns: Set Number | Previous (History) | kg | Reps | Checkmark.

Logic: Tapping "Checkmark" marks set complete, saves to local store, and Auto-starts Rest Timer.

Plate Calculator:

User taps the "W" (Weight) label or a specific icon.

Modal appears showing visual representation of plates required (e.g., 20kg bar + 2x20kg).

Completion: User taps "Finish Workout". App syncs Zustand store to Appwrite database and clears local state.

C. History & Analytics

History: Uses FlashList to render potentially hundreds of past workouts without lag.

Analytics:

Volume: Line chart showing total volume per workout over time.

1RM: Estimated One Rep Max tracked per exercise.

## 6. Database Schema (Appwrite)
We will use an Appwrite Database with the following Collections.

**Database ID**: `6957f22d0020b7ce54e4` (`werkpro_db`)

### Collections:

#### **profiles**
*   `user_id` (string, required) - Relationship to Auth User (or use Document ID as User ID: `$id`)
*   `default_unit` (string, default: 'kg') - Enum: 'kg', 'lbs'
*   `timer_duration_sec` (integer, default: 120)

#### **exercises**
*   `user_id` (string) - Nullable. If null, it's a "System" exercise. If set, it's a user custom exercise.
*   `name` (string, required)
*   `target_body_part` (string)
*   `category` (string) - Enum: 'Barbell', 'Dumbbell', 'Machine', etc.

#### **templates**
*   `user_id` (string, required)
*   `name` (string, required)
*   `data` (string, size: 65535) - JSON string of exercises and sets
*   `$createdAt` (datetime, automatic)

#### **workouts**
*   `user_id` (string, required)
*   `template_id` (string) - Relationship to `templates`
*   `name` (string)
*   `start_time` (datetime, required)
*   `end_time` (datetime)
*   `volume_kg` (double)
*   `note` (string, size: 1000)

#### **workout_exercises** (New)
*   `workout_id` (string, required) - Relationship to `workouts`
*   `exercise_id` (string, required) - Relationship to `exercises`
*   `order` (integer, required) - The sequence in the workout

#### **workout_sets**
*   `workout_id` (string, required) - Relationship to `workouts` (for easier querying)
*   `workout_exercise_id` (string, required) - Relationship to `workout_exercises` (Parent)
*   `set_order` (integer, required)
*   `weight` (double, required)
*   `reps` (integer, required)
*   `type` (string, default: 'normal')
*   `completed` (boolean, default: false)
*   `rest_timer_duration` (integer) - The rest taken *after* this set
*   `rpe` (integer)

## 7. Constraints & Rules
No MMKV: Use @react-native-async-storage/async-storage for all local persistence.

Custom Input Handling: Never use TextInput auto-focus for workout sets. Use a custom logic to map the CustomNumberPad presses to the active field.

Strict Typing: No any. All DB types must be defined in /types based on the Appwrite Models.

Offline First: The app must function if the Appwrite connection fails. Queue finished workouts in AsyncStorage and sync when connection restores.

Component Size: Keep components small. Isolate SetRow, RestTimer, and Chart into separate files.

## 8. Security
Env Variables: Store `EXPO_PUBLIC_APPWRITE_ENDPOINT` and `EXPO_PUBLIC_APPWRITE_PROJECT_ID` in .env.

Database Permissions:
*   **profiles**: User can Read/Update their own.
*   **exercises**: User can Read System exercises. User can CRUD their own exercises.
*   **templates, workouts, workout_sets**: User can CRUD their own documents.

Implementation: Use Appwrite Document Security (Permissions) where `role:member` or `user:[ID]` is granted specific rights.