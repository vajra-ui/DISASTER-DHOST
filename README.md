# 🚨 DISASTER DHOST
### Decentralized Emergency Mesh, Zero-Auth SOS & Tactical Incident Command System

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Offline Mesh Ready](https://img.shields.io/badge/Offline_Mesh-Ready-10B981)](#offline-security-architecture)

---

## 🌟 Core Philosophy

> **"NO LOGIN BETWEEN A PERSON AND HELP."**
> 
> In a crisis, forcing a victim to create an account, remember passwords, or verify OTPs can cost lives. DISASTER DHOST guarantees instantaneous access to life-saving SOS broadcasts, citizen safe check-ins, and community hazard reporting without any authentication barrier.

---

## 👥 Multi-Role Operational Matrix

| User Role | Call Sign / ID | Demo PIN | Route | Clearance & Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Victim / Citizen** | Anonymous Token (`DD-XXXXXX`) | *None (Zero-Auth)* | `/`, `/victim` | Instant 1-tap SOS wizard, GPS + Battery telemetry, audio/text distress packet, live multi-hop mesh tracking beacon. |
| **Safe Citizen** | Anonymous Token | *None (Zero-Auth)* | `/safe` | Broadcast "I'M SAFE" beacon across mesh transceivers without clogging emergency responder dispatch queues. |
| **Volunteer Reporter** | Anonymous Token | *None (Zero-Auth)* | `/help-others` | Submit observed hazards & stranded groups tagged with high-visibility `COMMUNITY REPORT` badge. |
| **Commander (EOC)** | `CMD-001` *(Capt. Rajesh Varma)* | `9900` | `/command` | District Emergency Operations Center dashboard, KPI telemetry, incident priority overrides, team assignments, raw packet inspection. |
| **Rescue Team Alpha** | `RSC-1042` *(Sgt. Ananya Sen)* | `9900` | `/rescue` | Tactical field dispatch, Tamil/Hindi auto-translation, landmark navigation, 5-step dispatch progression. |
| **Medical Corps** | `MED-204` *(Dr. K. Raghavan)* | `9900` | `/medical` | Rapid casualty triage queue (🔴 Red / 🟡 Yellow / 🟢 Green / ⚫ Black), symptom tracking, and 1-click **Air/Boat Medevac Escalation**. |
| **Mesh Network** | Public / Operator | — | `/network` | Live transceiver grid (LoRa 868 MHz, Base Stations, Drones, Responders), RSSI dBm, and hop path inspector. |
| **Disaster Simulator** | Operator / Demo | — | `/simulation` | Disaster scenario testbench (Flash flood surge injection, cellular blackout, and drone dynamic rerouting). |

---

## 🛡️ Offline Security Architecture

1. **`OFFLINE_TRUSTED` Responder Session:**
   - Authenticated responders retain local cryptographic credentials.
   - When cellular coverage fails or enters blackout, active responders remain in `OFFLINE_TRUSTED` state with full operational dashboard capabilities.
2. **Strict Offline Login Rejection:**
   - Unauthenticated logins attempted offline are strictly denied:
     ```
     "NETWORK UNAVAILABLE: New responder verification requires connectivity or authorized local provisioning. [ REQUEST ACCESS ]"
     ```
   - Clicking `[ REQUEST ACCESS ]` presents the device hardware signature (`DHOST-DEV-8A7FEF4-93`) for physical key-signing at Incident Command Base.
3. **Safe Offline Logout Protection:**
   - Prevents accidental responder credential purge in disaster zones while keeping cached local emergency packets intact.

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 3. Production Build
```bash
npm run build
```

---

## ⚡ Demo Quick Switcher & Simulation

Use the **`⚡ Demo Switcher`** button located on the top sticky system bar to instantly:
- Jump between any role (Victim, Commander, Rescue Team, Medical Corps, Safe Check-In, Volunteer).
- Toggle live network simulation modes:
  - 🟢 **`ONLINE`** (High-speed cellular & cloud relay)
  - 🟡 **`OFFLINE_MESH`** (Ad-hoc LoRa 868 MHz & Peer-to-Peer DHOST nodes)
  - 🔴 **`BLACKOUT`** (Zero cellular infrastructure, purely localized mesh packet forwarding)

---

## 📜 License
Developed with ❤️ for resilient disaster management and life safety.
