# OutfitMixer

A personal wardrobe randomizer and weekly outfit planner. Limited budget, thrift-store finds, a dress code, and a genuine hatred of standing in front of a closet at 7am asking "does this even go together?" OutfitMixer solves that — upload your clothes once, let the app suggest color-compatible outfits by vibe, confirm a week's worth in advance, and never think about it again until laundry day. Yes, socks are a tracked item.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Framer Motion |
| Auth | Firebase Auth — Google Sign-In only |
| Database | Firestore |
| Storage | Firebase Storage (item images) |
| Hosting | Vercel (free tier) |

---

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your Firebase config
3. Install dependencies: `npm install`
4. Run locally: `npm run dev`

### Firebase setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Google Sign-In** under Authentication → Sign-in methods
3. Enable **Firestore** and **Storage**
4. Add your web app and copy the config values into `.env.local`

### Firestore security rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Features

- **Wardrobe Manager** — Upload photos per category (head, top, bottom, shoes, socks, accessory) with color and vibe tags
- **Color-Aware Randomizer** — Generates outfits filtered by vibe, checks color family compatibility before suggesting
- **Week Planner** — 7-day grid, slot saved outfits into days
- **Highlights** — Named weekly collections (Strathmore Week, Chill Weekend, Fancy Out, Home Fits, or custom)

---

## Vibe Tags

| Tag | Description |
|---|---|
| `strathmore` | Smart-casual, collared, school-appropriate |
| `chill-weekend` | Casual, relaxed, going-out-with-friends energy |
| `fancy-out` | Dressed up, fedora territory |
| `home` | Comfortable, wearable outside in a pinch |

---

## Color Logic

Color families: `neutral`, `earth`, `warm`, `cool`

| Combo | Result |
|---|---|
| neutral + any | ✅ |
| earth + neutral/warm | ✅ |
| cool + cool/neutral | ✅ |
| warm + warm | ⚠️ warn |
| warm + cool | ❌ reshuffle |

The randomizer runs up to 5 attempts to find a color-compatible outfit before giving up.
