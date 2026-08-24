# Safety Dosth: Your Safe Route

Safety Dosth — Real-Time Safe Navigation Platform

Build a production-quality, mobile-first application called Safety Dosth.

Brand

Name: Safety Dosth

Tagline:

Your Route. Your Dosth. Your Safety.

The spelling must be Dosth everywhere. Do not use “Doshth” anywhere in the UI, code labels, page titles, metadata, or branding.

1. Core Concept

Safety Dosth is a real-time safe navigation platform.

The core idea:

“Maps find your route. Safety Dosth helps you choose the safer way.”

The app must work with real-world locations and real navigation.

ABSOLUTE REQUIREMENT — NO MOCK DATA

Do NOT use mock data for:

Routes

Streets

Locations

GPS coordinates

Distance

ETA

Hospitals

Police stations

Pharmacies

Places

Weather

Public transport

Navigation

Safety incidents

Community reports

Safety scores

If real information cannot be obtained from an available API/data source, show “Data unavailable” instead of inventing information.

The user must be able to enter arbitrary real locations, including local streets.

Example:

From: Current Location
To: [Any real street]

The app must geocode the destination and calculate an actual route.

2. Splash Screen

Create a polished animated splash screen.

Display:

SAFETY DOSTH

Your Route. Your Dosth. Your Safety.

Use a modern shield + location-pin visual identity.

Animation:

Logo appears

Shield/location icon animates

Brand name appears

Tagline fades in

Smooth transition to onboarding/home

Keep the splash animation short and professional.

3. Onboarding

Create a simple 3-step onboarding.

Screen 1

Travel Smarter

Find real routes to any destination.

Screen 2

Travel Safer

Get safety information for your journey wherever reliable data is available.

Screen 3

Stay Connected

Share your journey with people you trust.

Then request location permission.

Explain why location is required.

If permission is denied, allow manual location search.

4. Real Location

Use the device/browser's actual Geolocation API.

Requirements:

Current latitude/longitude

Live location updates

Location accuracy

Permission handling

GPS unavailable handling

Location timeout handling

Never hardcode the user's location.

5. Real Map Integration

Integrate a real map provider and real routing/geocoding services.

The architecture should support:

Geocoding

Address → latitude/longitude

Reverse Geocoding

Latitude/longitude → readable address

Routing

Origin → destination → real route

Support, where the selected routing provider allows:

Walking

Driving

Cycling

Other appropriate transport modes

Show:

Real distance

Real ETA

Real route geometry

Turn-by-turn instructions

The route must work for arbitrary real streets and locations.

Do not create predefined demo routes.

6. Home Screen

The Home screen should immediately look like a modern navigation application.

Display:

Where are you going?

From

Current Location

To

Search destination

Allow:

Address search

Street search

Landmark search

Business/place search

Map selection

Primary CTA:

Find Safe Routes

Secondary:

Pick on Map

Recent destinations should only contain actual destinations searched by the user.

7. Real Route Results

After entering a destination, calculate real routes.

Display available real route options.

For example:

Fastest

18 min · 2.1 km

Balanced

21 min · 2.4 km

Safer

24 min · 2.6 km

However:

Do not invent a “Safer” route or safety score if there is insufficient real safety data.

Only classify a route as safer when supported by actual available safety information.

Otherwise display:

Safety comparison unavailable

This is important for trust.

8. Safety Intelligence Layer

Create a safety-analysis layer on top of the actual route.

Where reliable data exists, consider:

Community safety reports

Verified incidents

Lighting information

CCTV information

Crowd/public activity

Nearby hospitals

Police stations

Pharmacies

Open businesses

Public transport

Weather

Road conditions

Time of day

Every safety factor must have a genuine source.

Clearly distinguish:

Verified

Reliable external/source data.

Community

User-submitted information.

Unknown

No reliable data available.

Never convert unknown data into a fake positive or negative score.

9. Explainable Safety

For every safety recommendation, provide:

Why this route?

Example:

✓ More verified safe places nearby
✓ Fewer recent community warnings
✓ Better access to public places
✓ Suitable current conditions

Also show:

Some safety information is unavailable for this route.

Users must be able to understand how the recommendation was made.

10. Live Navigation

Create a full-screen navigation mode.

Show:

Current real GPS location

Real route

Destination

Remaining distance

ETA

Current instruction

Next turn

Route progress

Continuously update the user's real position.

If the user deviates significantly:

⚠️ You've moved away from your route.

Automatically calculate a new real route.

Do not move a simulated marker.

11. DOSTH MODE

When navigation begins:

🛡️ DOSTH MODE ACTIVE

Display:

Live location

Destination

ETA

Journey progress

Current safety information

Trusted Circle status

Controls:

Share Journey

Pause

End Journey

12. Trusted Circle

Allow users to add trusted contacts.

Each contact should be real user-provided information.

During a journey:

Share My Journey

Share:

Current location

Destination

ETA

Journey status

Sharing must be private and user-controlled.

The user can stop sharing at any time.

Do not expose live location publicly.

13. Safety Check

During DOSTH MODE, support configurable safety checks.

If a configured safety trigger occurs, show:

Are you okay?

Buttons:

I'm Safe

Dismiss.

Need Help

Open emergency assistance.

Contact Trusted Person

Contact the selected trusted person.

Do not automatically assume that route deviation means an emergency.

14. Safe Places

Use real place data.

Show nearby:

Hospitals

Police stations

Pharmacies

Emergency services

Other suitable public safe locations

Every result must contain real:

Name

Address

Coordinates

When the user taps:

Navigate Here

calculate a real route from their current location.

15. Community Reports

Allow users to submit actual reports.

Categories:

Poor lighting

Isolated area

Harassment concern

Suspicious activity

Road issue

Other safety concern

Capture:

Actual location

Timestamp

Category

Description

Optional photo

Reports must be associated with authenticated users.

16. Report Trust System

Do not treat every report as verified.

Use states:

Community Report

Multiple Reports

Verified

Allow appropriate confirmation/review.

Consider:

Recency

Number of reports

Confirmation

Location consistency

Do not create fake incident counts.

17. Weather

Integrate a real weather provider where possible.

Show current/relevant forecast conditions.

Example:

🌧️ Rain expected along part of your route.

If weather data cannot be retrieved:

Weather information unavailable

Never display fake weather.

18. Public Transport

Where reliable real public transport data is available, show:

Actual stops

Actual routes

Timings

Availability

Relevant safety information

If the selected area has no supported real-time data:

Live public transport information unavailable in this area.

Do not invent bus numbers or timings.

19. Offline Mode

Provide a limited offline safety experience.

Cache only necessary information for the active journey.

Show:

Offline Mode

Clearly communicate that:

Live traffic may be unavailable

Live safety information may be unavailable

Live weather may be unavailable

Do not pretend offline data is live.

20. Privacy & Security

Location is sensitive.

Implement:

Explicit location permission

User-controlled journey sharing

Stop-sharing control

Secure authentication

Secure database access

Appropriate backend authorization

Minimal location-history storage

User data deletion controls

Never expose private live locations publicly.

21. Backend

Use a proper backend/database for:

Authentication

Profiles

Trusted contacts

Community reports

Report confirmations

Journey sessions

Preferences

User settings

Use secure environment variables for API keys.

Never expose secret API keys in frontend code.

22. Error Handling

Handle:

Location permission denied

GPS unavailable

Network failure

Geocoding failure

Routing failure

API rate limits

Invalid address

No route available

Backend failure

Weather API failure

Missing safety data

Use friendly messages such as:

We couldn't calculate a route right now. Please try again.

Never replace API failures with mock data.

23. Main Navigation

Use a simple mobile bottom navigation:

🏠 Home

Search and navigation.

🗺️ Explore

Map, nearby places and available safety information.

🚨 Reports

Community safety reports.

🛡️ Dosth

Active journey, DOSTH MODE and trusted circle.

👤 Profile

Settings, privacy and emergency contacts.

24. Visual Design

Use a light, modern, premium UI.

The design should feel:

Safe

Friendly

Trustworthy

Modern

Minimal

Easy to understand

Avoid making it look like a police/security dashboard.

Use:

Rounded components

Clean cards

Large map area

Clear typography

Strong primary CTA

Subtle animations

Smooth page transitions

Accessible contrast

Use meaningful colors for states:

🟢 Safe/positive information

🟡 Caution

🔴 Alert

⚪ Unknown

Do not use color alone to communicate important information; pair it with labels/icons.

25. Important UX Principle

A user should be able to:

Open app

↓

Allow location

↓

Enter destination

↓

See actual routes

↓

Choose route

↓

Start navigation

with minimal interaction.

Do not force users through unnecessary screens.

26. No Fake UI

Do not add fake:

Counters

Reviews

Users

Incident numbers

Safety percentages

Subscribers

Map markers

Routes

Statistics

Empty state is better than fake content.

For example:

No community reports found in this area.

instead of:

23 people reported this area.

27. Acceptance Test

Before considering the application finished, test the following:

Splash screen works.

Onboarding works.

Location permission works.

Real current location appears.

Search accepts arbitrary real streets.

Real geocoding works.

Real route calculation works.

Real distance appears.

Real ETA appears.

Map displays actual route.

Navigation follows actual GPS.

Route deviation triggers correctly.

Route recalculation works.

DOSTH MODE works.

Trusted Circle works.

Journey sharing works.

Safety check works.

Real nearby places appear.

Navigation to a nearby place works.

Community report submission works.

Community reports appear correctly.

Weather works when supported.

Unsupported data shows “Data unavailable.”

Network failures are handled.

Location permission denial is handled.

Mobile UI works correctly.

Desktop UI works correctly.

No mock routes or fake location data remain anywhere.

FINAL RULE

Safety Dosth must be a real working navigation product, not a simulated prototype.

If an API or data source is unavailable, show an honest unavailable state.

Never fabricate real-world data just to make the interface look complete.

The final experience should feel like:

A real navigation app + a real-time safety intelligence layer + a personal journey companion.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://safety-dosth.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/09c30897-d3e5-426e-9305-4f2391776ec1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
