# WerkPro

**WerkPro** is a high-performance, offline-first mobile workout tracker built with React Native and Appwrite. Designed for speed and precision, it focuses on friction-free logging and a "Pro" utility aesthetic optimized for OLED displays.

![WerkPro Hero](https://via.placeholder.com/800x400.png?text=WerkPro+Fitness+Tracker)

## 🚀 Key Features

- **⚡ Custom Numeric Keyboard:** A specialized input pad designed for rapid weight and rep entry, bypassing the clunkiness of system keyboards.
- **📋 Advanced Template Management:** Create, edit, and manage unlimited workout templates with serialized JSON storage for flexible routine structures.
- **🔢 Interactive Plate Calculator:** Instantly visualize the exact plate combinations needed for any given weight (supports 20kg bar and standard plates).
- **⏱️ Auto Rest Timer:** Intelligent rest timer that starts automatically after completing a set, keeping your workout on track.
- **📊 Performance Analytics:** Track Volume and estimated One Rep Max (1RM) with intuitive charts and history logs.
- **📱 Header-Restricted Gestures:** Optimized navigation with restricted swipe-down-to-dismiss gestures to prevent accidental closure during scrolling.
- **☁️ Appwrite Integration:** Cloud synchronization for workouts, templates, and exercise libraries.
- **🌙 OLED Dark Mode:** Deep black theme designed for high contrast and battery efficiency.

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev/) (SDK 54) with **Expo Router**
- **Language:** TypeScript
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **State Management:**
  - **Local/Session:** [Zustand](https://github.com/pmndrs/zustand)
  - **Database & Auth:** [Appwrite](https://appwrite.io/)
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Icons:** [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Persistence:** `@react-native-async-storage/async-storage`

## 🏁 Getting Started

### Prerequisites

- Node.js & Bun (recommended)
- Expo Go app on your mobile device or an emulator
- An Appwrite project instance

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/knockoffduck/WerkPro.git
   cd WerkPro
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Appwrite credentials:
   ```env
   EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   ```

4. **Start the development server:**
   ```bash
   bun start
   ```

## 📂 Project Structure

```text
/app                # File-based routing (Expo Router)
  /(auth)           # Authentication flow (Login/Signup)
  /(tabs)           # Main application navigation
  /workout          # Active workout session (id-based modal)
/components         # Reusable UI components
  /active-workout   # Specialized workout logging components
  /keyboard         # Custom numeric keyboard implementation
  /templates        # Template management components
/store              # Zustand stores (Workout, Template)
/hooks              # Custom React hooks (Timer, Auth)
/lib                # Third-party service configurations (Appwrite)
/types              # TypeScript interfaces and models
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and for educational/personal use.

---

Built with ❤️ for the high-performance fitness community.
