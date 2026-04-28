You are an expert full-stack developer.

Build a polished MVP web app for House of AB called:

House of AB Scent Finder

The app should allow users to enter:
1. A favourite perfume name, e.g. “Oud for Greatness”
2. Favourite notes, e.g. “oud, rose, musk”
3. Mood/profile words, e.g. “warm, sensual, fresh, smoky”

The app should then recommend the best matching House of AB fragrance from the provided fragrance library.

Tech stack:
- React + Vite
- Plain CSS or Tailwind CSS
- No backend for MVP
- Store fragrance data in a local `src/data/fragrances.js` file
- Build a clean, luxury UI with House of AB styling:
  - Deep black: #0F0F0F
  - Charcoal: #1A1A1A
  - Champagne gold: #C6A37A
  - Soft ivory: #E8DCCB
  - Soft white: #F5F5F5
  - Elegant serif headings
  - Minimal, premium layout

Core features:
1. Landing section:
   - Title: “Find Your House of AB Scent”
   - Subtitle: “Enter your favourite perfume, notes, or mood — and discover the scent that matches your profile.”

2. Input section:
   - Textarea for user input
   - Placeholder: “Try: oud, rose, smoky, warm”
   - Button: “Find My Scent”

3. Recommendation engine:
   - Match user input against:
     - fragrance notes
     - profile tags
     - scent families
     - related/similar words
   - Use weighted scoring:
     - exact note match = +3
     - scent family match = +2
     - profile tag match = +2
     - related mood/synonym match = +1
   - Return top 3 results ranked by score
   - Convert score into confidence percentage

4. Result cards:
   Each result should show:
   - Fragrance name
   - Confidence percentage
   - Description
   - Notes
   - Profile tags
   - Scent family
   - Explanation, e.g. “Matched because you mentioned oud, smoky, and warm notes.”

5. Include a “Best Match” badge on the highest scoring result.

6. Add example chips users can click:
   - Oud
   - Rose
   - Musk
   - Fresh
   - Smoky
   - Sweet
   - Floral
   - Spicy
   - Clean
   - Warm

7. Add a CTA under the results:
   - “Want to experience this scent at your event?”
   - Button: “Enquire with House of AB”

8. Make it responsive for mobile.

Use this fragrance dataset:

[
  {
    name: "AZMIR",
    description: "A rich, warm embrace of labdanum, blooming into the dark, wine-stained depth of rose, and settling into powerful, smoky agarwood.",
    notes: {
      base: ["Labdanum"],
      top: ["Rose"],
      heart: ["Agarwood", "Oud"]
    },
    profileTags: ["Regal", "Abyssal", "Sacred"],
    scentFamily: ["Oriental", "Woody", "Resinous"]
  },
  {
    name: "IMPERIUM",
    description: "A golden blend of lemon, jasmine, and musk — perfect for twilight moments that linger.",
    notes: {
      base: ["Lemon"],
      top: ["Jasmine"],
      heart: ["Musk"]
    },
    profileTags: ["Warm", "Mysterious", "Captivating"],
    scentFamily: ["Citrus", "Floral", "Musky"]
  },
  {
    name: "NOCTORA",
    description: "A delicate, milky whisper of almond, blooming into the lush, narcotic heart of tuberose, anchored by deep, woody patchouli.",
    notes: {
      base: ["Almond"],
      top: ["Tuberose"],
      heart: ["Patchouli"]
    },
    profileTags: ["Opulent", "Sultry", "Nocturne"],
    scentFamily: ["Gourmand", "Floral", "Woody"]
  },
  {
    name: "AMORIA",
    description: "The effervescent brightness of bergamot opens into the dewy elegance of lily, settling into clean, airy white musk.",
    notes: {
      base: ["Bergamot"],
      top: ["Lily"],
      heart: ["White Musk", "Musk"]
    },
    profileTags: ["Luminous", "Ethereal", "Pristine"],
    scentFamily: ["Fresh", "Floral", "Musky", "Clean"]
  },
  {
    name: "MAVROS",
    description: "Dry, ethereal incense merges with the brooding power of oud, cushioned by the velvety texture of amberwood.",
    notes: {
      base: ["Incense"],
      top: ["Oud", "Agarwood"],
      heart: ["Amberwood"]
    },
    profileTags: ["Archaic", "Immersive", "Monolithic"],
    scentFamily: ["Woody", "Smoky", "Amber"]
  },
  {
    name: "NOIR",
    description: "An intoxicating blend of crisp pear, jasmine, and earthy patchouli — a timeless scent for the bold, calm, and mysterious.",
    notes: {
      base: ["Patchouli", "Vanilla", "Cedar"],
      top: ["Jasmine", "Dark Coffee", "Coffee"],
      heart: ["Pink Pepper", "Orange Blossom", "Crisp Pear", "Pear"]
    },
    profileTags: ["Sweet", "Calming", "Fruity"],
    scentFamily: ["Fruity", "Floral", "Woody", "Sweet"]
  },
  {
    name: "RIVIÉR",
    description: "A cool, aromatic bite of artemisia, blooming into the dense spice of Bulgarian rose, anchored by warm, sensual leather.",
    notes: {
      base: ["Artemisia"],
      top: ["Bulgarian Rose", "Rose"],
      heart: ["Leather"]
    },
    profileTags: ["Exquisite", "Romantic", "Velvety"],
    scentFamily: ["Aromatic", "Floral", "Leather"]
  },
  {
    name: "ELARA",
    description: "A rich infusion of saffron, brightened by hedione, grounded in cedar — perfect for bold intentions and lingering warmth.",
    notes: {
      base: ["Saffron"],
      top: ["Hedione"],
      heart: ["Cedar"]
    },
    profileTags: ["Rare", "Earthy", "Bold"],
    scentFamily: ["Spicy", "Woody", "Amber"]
  },
  {
    name: "VELORA",
    description: "Spicy cinnamon warmth melts into the shimmering sweetness of litchi, deepened by smoky, resinous agarwood.",
    notes: {
      base: ["Cinnamon"],
      top: ["Litchi", "Lychee"],
      heart: ["Agarwood", "Oud"]
    },
    profileTags: ["Spicy", "Gourmand", "Intrepid"],
    scentFamily: ["Spicy", "Sweet", "Woody", "Smoky"]
  }
]

Add a synonym/related word map so the app understands:
- oud = agarwood, woody, smoky, resinous
- fresh = clean, citrus, airy, bright
- sweet = vanilla, gourmand, fruity
- floral = rose, jasmine, lily, orange blossom, tuberose
- warm = amber, spicy, musk, resinous
- dark = smoky, oud, leather, incense
- sensual = leather, musk, rose, amber
- clean = white musk, fresh, airy, pristine

Important:
- Keep the code clean and commented.
- Create separate files:
  - `src/data/fragrances.js`
  - `src/utils/recommendation.js`
  - `src/App.jsx`
  - `src/App.css`
- Include clear setup instructions in `README.md`.
- The app should run with:
  - npm install
  - npm run dev

After building, review the app for bugs, edge cases, and mobile responsiveness.