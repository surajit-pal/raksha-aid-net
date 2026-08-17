# RakshaNet: India's First Response

Build a polished, responsive hackathon MVP called **RakshaNet — The Community First-Response Network for India's Golden Hour**.

RakshaNet is a road-safety platform designed to reduce the critical delay between a road accident and the arrival of professional emergency services.

Core flow:

**GUIDE → CONNECT → ASSURE → HANDOVER**

### Main Features

1. **Landing Page**

- Strong hero section with:

  “When every minute matters, help shouldn't have to wait.”

- Explain the problem: bystanders often hesitate because they don't know what to do, who can help, or fear the consequences.

- Show the RakshaNet flow:

  Accident → Guidance → Nearby Responder → Emergency Services → Hospital.

2. **Emergency Response**

- Large **“ACTIVATE RAKSHANET”** button.

- Capture location.

- Generate an incident ID.

- Simulate notification to emergency services.

- Ask simple questions:

  - Is the person conscious?

  - Are they breathing normally?

  - Is there severe bleeding?

  - How many people are injured?

3. **Guide Me**

- Create a simple voice-first emergency guidance feature.

- Use large buttons and simple step-by-step instructions.

- Include a **“🎙️ Guide Me”** button that reads instructions aloud.

- Focus on safe first-response guidance such as bleeding control and monitoring an unconscious person.

- Do not attempt medical diagnosis.

4. **Nearby Responders**

- Show nearby verified Micro-Responders such as petrol-pump workers, dhaba workers, toll operators and student volunteers.

- Show name, training level, distance, ETA and verified status.

- Rank them primarily by estimated time-to-help.

- Add **“Request Responder”**.

- Simulate a responder accepting and show their ETA/status.

5. **Responder Dashboard**

- Show incoming accident alerts.

- Allow responder to:

  Accept → En Route → Arrived → Assistance Provided → Handover.

- Display incident location, victim information and ETA.

6. **RakshaPass**

- Generate a digital **Good Samaritan Assistance Record** after assistance.

- Show incident ID, responder ID, location, date/time, assistance provided and emergency-services notification.

- Add a **Print/Download** option.

- Clearly state that RakshaPass is documentation and does not itself create legal immunity.

7. **Training**

- Create a simple Micro-Responder training section with:

  - Accident Scene Safety

  - Severe Bleeding

  - Unconscious Victim

  - CPR Awareness

  - Good Samaritan Rights

- Show training progress and a verified responder status.

8. **Admin Dashboard**

- Show:

  Active Incidents

  Available Responders

  Responders En Route

  Median Time-to-First-Help

  Bystander Intervention Rate

- Include a simple visual flow/map showing:

  Accident → Responder → Emergency Services → Hospital.

### Demo Mode

Include realistic demo data so the complete journey can be demonstrated:

**Accident → Activate → Location → Guide Me → Nearby Responders → Responder Accepts → ETA → Assistance → RakshaPass**

### Design

Make it look like a professional civic-tech emergency platform:

- Modern

- Mobile-first

- Clean and trustworthy

- Large emergency buttons

- High contrast

- Professional cards and icons

- Red/orange for emergency actions

- Blue/navy for trust

- Green for verified/success states

- Smooth but subtle animations

Prioritize a polished working user experience and the complete emergency-response flow over unnecessary advanced features.

Do not use generic hospital-management styling. Make RakshaNet feel like a real emergency-response startup ready for a hackathon demo.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a604b9e0-d356-4a01-8923-d03bfa2c4fcc).

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
