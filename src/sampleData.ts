import { HistoryItem, TasteProfile } from './types';

export const INITIAL_HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 'evt-shorts-1',
    type: 'youtube_shorts',
    isShorts: true,
    title: 'The chilling silence in Oppenheimer bomb test scene explained #shorts',
    channel: 'CinemaEdits',
    duration: '0:54',
    url: 'https://youtube.com/shorts/oppenheimer-silence-edit',
    timestamp: '45 mins ago',
    notes: 'Captured from YouTube Shorts feed. Sound design breakdown & reaction.',
    detectedMovie: 'Oppenheimer (2023)'
  },
  {
    id: 'evt-1',
    type: 'youtube',
    title: 'Why Denis Villeneuve Is The Modern Master of Tension (Video Essay)',
    channel: 'Thomas Flight',
    duration: '18:42',
    url: 'https://youtube.com/watch?v=dv-tension-mastery',
    timestamp: '2 hours ago',
    notes: 'Completed full watch. Focus on Sicario and Prisoners pacing.',
    detectedMovie: 'Sicario / Prisoners'
  },
  {
    id: 'evt-shorts-2',
    type: 'youtube_shorts',
    isShorts: true,
    title: '3 Mindfuck movies with endings you will never predict #shorts',
    channel: 'FilmBuffShorts',
    duration: '0:42',
    url: 'https://youtube.com/shorts/mindfuck-endings-recs',
    timestamp: 'Yesterday at 3:20 PM',
    notes: 'Captured from YouTube Shorts scroll. Referenced Incendies and Coherence.',
    detectedMovie: 'Mind-bending Cinema'
  },
  {
    id: 'evt-2',
    type: 'pirate_stream',
    title: 'Watch Cure (Kyua 1997) Full Movie HD Free Online',
    url: 'https://fmovies24.to/watch-cure-1997-free.html',
    timestamp: 'Yesterday at 11:45 PM',
    notes: 'Plotted DOM observer caught HTML5 video stream on unindexed host. Title cleaned: "Cure (1997)".',
    detectedMovie: 'Cure (Kyua) (1997)'
  },
  {
    id: 'evt-3',
    type: 'search',
    title: 'Search: movies with unreliable narrator and shocking plot twist reddit',
    query: 'movies with unreliable narrator and shocking plot twist reddit',
    url: 'https://www.google.com/search?q=movies+with+unreliable+narrator+and+shocking+plot+twist+reddit',
    timestamp: 'Yesterday at 9:15 PM',
    notes: 'Read top 4 Reddit recommendation threads on r/movies and r/TrueFilm.',
    detectedMovie: 'Psychological Thriller Tropes'
  },
  {
    id: 'evt-4',
    type: 'youtube',
    title: 'David Fincher - The Art of Cinematic Information Control',
    channel: 'Every Frame a Painting',
    duration: '12:15',
    url: 'https://youtube.com/watch?v=fincher-cinematic-control',
    timestamp: '2 days ago',
    notes: 'Watched twice. High interest in Zodiac and Se7en blocking.',
    detectedMovie: 'Zodiac / Se7en'
  },
  {
    id: 'evt-5',
    type: 'pirate_stream',
    title: 'Memories of Murder (2003) 1080p BluRay English Sub | Soap2Day',
    url: 'https://soap2day.ac/movie/watch-memories-of-murder-2003',
    timestamp: '3 days ago',
    notes: 'Underground video player captured: 132 min continuous streaming detected.',
    detectedMovie: 'Memories of Murder (2003)'
  },
  {
    id: 'evt-6',
    type: 'search',
    title: 'Search: best neo noir films 2010 to 2024 letterboxd',
    query: 'best neo noir films 2010 to 2024 letterboxd',
    url: 'https://www.google.com/search?q=best+neo+noir+films+2010+to+2024+letterboxd',
    timestamp: '3 days ago',
    notes: 'Explored Letterboxd lists featuring Nightcrawler, Blade Runner 2049, Drive.',
    detectedMovie: 'Neo-Noir Genre'
  },
  {
    id: 'evt-7',
    type: 'youtube',
    title: 'Primer (2004) - The Most Complex Time Travel Movie Ever Made (Timeline Breakdown)',
    channel: 'CinemaWins',
    duration: '24:50',
    url: 'https://youtube.com/watch?v=primer-timeline-explained',
    timestamp: '4 days ago',
    notes: 'Watched diagram breakdown of multiple overlapping timelines.',
    detectedMovie: 'Primer (2004)'
  },
  {
    id: 'evt-8',
    type: 'pirate_stream',
    title: 'Burning (Beoning 2018) Full Movie English Sub Stream | Bflix',
    url: 'https://bflix.sx/watch-burning-2018.html',
    timestamp: '5 days ago',
    notes: 'Detected unindexed video iframe player with Haruki Murakami mystery drama.',
    detectedMovie: 'Burning (2018)'
  },
  {
    id: 'evt-9',
    type: 'official_stream',
    title: 'Watched: Arrival (2016) on Prime Video',
    url: 'https://www.primevideo.com/detail/Arrival',
    timestamp: '6 days ago',
    notes: 'Completed entire film playback via official streaming portal.',
    detectedMovie: 'Arrival (2016)'
  },
  {
    id: 'evt-10',
    type: 'search',
    title: 'Search: why did the ending of enemy by denis villeneuve have a spider',
    query: 'why did the ending of enemy by denis villeneuve have a spider',
    url: 'https://www.google.com/search?q=enemy+denis+villeneuve+spider+ending+explained',
    timestamp: '1 week ago',
    notes: 'Post-watch inquiry: read multiple psychoanalytic interpretations.',
    detectedMovie: 'Enemy (2013)'
  }
];

export const CLEAN_SLATE_TASTE_PROFILE: TasteProfile = {
  tasteArchetype: "Uncalibrated Film Explorer",
  archetypeDescription: "You haven't logged any viewing history yet. Start watching YouTube video essays, scrolling cinema Shorts, searching movie queries, or streaming films to uncover your personalized Taste DNA.",
  tasteDna: {
    genres: [
      { name: "Cinema Ingestion Ready", percentage: 100 }
    ],
    themes: [
      "Awaiting watch history & search signals",
      "Ready to analyze narrative styles",
      "Streaming player detection active"
    ],
    directors: ["Pending user watch activity..."],
    pacingPreference: "Calibrating based on initial signals...",
    visualStyle: "Calibrating visual preference..."
  },
  capturedSignalsSummary: {
    totalEvents: 0,
    youtubeHighlights: ["No YouTube activity detected yet."],
    searchHighlights: ["No movie searches logged yet."],
    pirateStreamHighlights: ["No web stream captures logged yet."],
    hiddenAffinitiesFound: "Browse YouTube, search on Google, or stream movies to train your AI Taste DNA."
  },
  recommendations: []
};

export interface TestPersona {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  history: HistoryItem[];
  profile: TasteProfile;
}

export const TEST_PERSONAS: Record<string, TestPersona> = {
  clean_slate: {
    id: 'clean_slate',
    name: 'Brand-New User (Clean Slate)',
    tagline: 'Zero history, fresh onboarding state to test from scratch',
    icon: '🧹',
    history: [],
    profile: CLEAN_SLATE_TASTE_PROFILE
  },
  existential_puzzle: {
    id: 'existential_puzzle',
    name: 'Existential Neo-Noir & Puzzle Seeker',
    tagline: 'Mind-benders, unreliable narrators & Denis Villeneuve',
    icon: '🧩',
    history: INITIAL_HISTORY_ITEMS,
    profile: INITIAL_TASTE_PROFILE
  },
  cyberpunk_scifi: {
    id: 'cyberpunk_scifi',
    name: 'Neon Cyberpunk & Hard Sci-Fi',
    tagline: 'Dystopian futures, artificial intelligence & existential space',
    icon: '🚀',
    history: [
      {
        id: 'evt-cb-1',
        type: 'youtube_shorts',
        isShorts: true,
        title: 'Blade Runner 2049 color grading breakdown #shorts',
        channel: 'ColoristCinema',
        duration: '0:50',
        url: 'https://youtube.com/shorts/br2049-color-edit',
        timestamp: '15 mins ago',
        notes: 'Explored neon teal-orange contrast in Denis Villeneuve cinematography.',
        detectedMovie: 'Blade Runner 2049'
      },
      {
        id: 'evt-cb-2',
        type: 'youtube',
        title: 'The Philosophy of The Matrix - Baudrillard Simulacra and Simulation',
        channel: 'Wisecrack',
        duration: '16:40',
        url: 'https://youtube.com/watch?v=matrix-philosophy',
        timestamp: '1 hour ago',
        notes: 'Deep dive into cyberpunk philosophy and simulation theory.',
        detectedMovie: 'The Matrix (1999)'
      },
      {
        id: 'evt-cb-3',
        type: 'search',
        title: 'Search: hard sci fi movies like interstellar with accurate physics reddit',
        query: 'hard sci fi movies like interstellar with accurate physics reddit',
        url: 'https://google.com/search?q=hard+sci+fi+movies+like+interstellar+with+accurate+physics+reddit',
        timestamp: '4 hours ago',
        notes: 'Targeting scientifically grounded space exploration.'
      },
      {
        id: 'evt-cb-4',
        type: 'pirate_stream',
        title: 'Watch Akira (1988) 4K Remaster Free Online | StreamLocker',
        url: 'https://streamlocker.is/watch-akira-1988-4k.html',
        timestamp: 'Yesterday',
        notes: 'Plotted detected Neo-Tokyo cyberpunk animated film stream.',
        detectedMovie: 'Akira (1988)'
      }
    ],
    profile: {
      tasteArchetype: "The Cybernetic Futurist & Dystopian Seeker",
      archetypeDescription: "You explore synthetic consciousness, high-tech dystopian urbanism, existential space travel, and grand philosophical dilemmas bathed in synth-wave aesthetics.",
      tasteDna: {
        genres: [
          { name: "Cyberpunk / Dystopian", percentage: 45 },
          { name: "Hard Sci-Fi", percentage: 32 },
          { name: "Philosophical Anime", percentage: 15 },
          { name: "Techno-Thriller", percentage: 8 }
        ],
        themes: ["Artificial Sentience & Human Identity", "Dystopian Megacorporations", "Theoretical Physics & Relativistic Time"],
        directors: ["Ridley Scott", "Denis Villeneuve", "Katsuhiro Otomo", "Christopher Nolan"],
        pacingPreference: "Atmospheric world-building with intense audiovisual climaxes",
        visualStyle: "Neon reflection in rain, brutalist architecture, towering holographic displays"
      },
      capturedSignalsSummary: {
        totalEvents: 4,
        youtubeHighlights: ["Blade Runner 2049 color grading breakdown #shorts", "Matrix philosophy video essay"],
        searchHighlights: ["Searched for hard sci-fi films with accurate physics"],
        pirateStreamHighlights: ["Watched Akira 4K remaster on StreamLocker"],
        hiddenAffinitiesFound: "Strong alignment with hand-drawn 80s anime cyberpunk and 70mm hard science fiction."
      },
      recommendations: [
        {
          id: 'rec-cb-1',
          title: 'Ghost in the Shell',
          year: 1995,
          director: 'Mamoru Oshii',
          matchScore: 99,
          genres: ['Cyberpunk', 'Animation', 'Sci-Fi'],
          posterDescription: 'Major Motoko Kusanagi suspended in cybernetic amniotic fluid.',
          backdropGradient: 'from-emerald-950 via-teal-900 to-black',
          overview: 'In 2029, cyborg federal agent Major Motoko Kusanagi tracks the Puppet Master, a phantom hacker infiltrating human cyber-brains.',
          whyItMatched: 'Matched your Akira stream and philosophical Matrix video essays.',
          triggerSignals: ['Pirate Stream: Akira (1988)', 'YouTube: Matrix Philosophy'],
          mood: 'Philosophical & Transhumanist',
          rating: '7.9/10 IMDb',
          runtime: '83 min',
          whereToWatch: ['Crunchyroll', 'Apple TV', 'Prime Video'],
          isUndergroundGem: false
        },
        {
          id: 'rec-cb-2',
          title: 'Upgrade',
          year: 2018,
          director: 'Leigh Whannell',
          matchScore: 94,
          genres: ['Action', 'Cyberpunk', 'Sci-Fi'],
          posterDescription: 'A paralyzed man equipped with an experimental AI chip with ruthless lethal instincts.',
          backdropGradient: 'from-cyan-950 via-blue-900 to-black',
          overview: 'Set in the near future, technology controls nearly all aspects of life. When Grey is left paralyzed, a STEM implant offers vengeance.',
          whyItMatched: 'Direct hit on your cyberpunk techno-thriller search query.',
          triggerSignals: ['Search: hard sci-fi cyberpunk movies', 'YouTube Shorts: BR2049 edit'],
          mood: 'Visceral & Kinetic',
          rating: '7.5/10 IMDb',
          runtime: '100 min',
          whereToWatch: ['Netflix', 'Apple TV'],
          isUndergroundGem: true
        }
      ]
    }
  },
  anime_nostalgia: {
    id: 'anime_nostalgia',
    name: 'Whimsical Anime & Nostalgic Auteur',
    tagline: 'Studio Ghibli, bittersweet youth & ethereal magical realism',
    icon: '🍃',
    history: [
      {
        id: 'evt-an-1',
        type: 'youtube_shorts',
        isShorts: true,
        title: 'Why Studio Ghibli food looks so comforting and delicious #shorts',
        channel: 'AnimeEats',
        duration: '0:45',
        url: 'https://youtube.com/shorts/ghibli-food-craft',
        timestamp: '30 mins ago',
        notes: 'Focused on hand-drawn textures and emotional warmth.',
        detectedMovie: 'Spirited Away'
      },
      {
        id: 'evt-an-2',
        type: 'youtube',
        title: 'Satoshi Kon - Editing Time and Space like a Magician',
        channel: 'Every Frame a Painting',
        duration: '10:20',
        url: 'https://youtube.com/watch?v=satoshi-kon-editing',
        timestamp: '3 hours ago',
        notes: 'Explored match cuts and dream logic in Millennium Actress and Paprika.',
        detectedMovie: 'Millennium Actress'
      },
      {
        id: 'evt-an-3',
        type: 'search',
        title: 'Search: movies that feel like a warm hug and bittersweet nostalgia',
        query: 'movies that feel like a warm hug and bittersweet nostalgia',
        url: 'https://google.com/search?q=movies+that+feel+like+warm+hug+nostalgia',
        timestamp: 'Yesterday',
        notes: 'Exploring heartfelt Japanese cinema.'
      }
    ],
    profile: {
      tasteArchetype: "The Poetic Dreamer & Nostalgic Humanist",
      archetypeDescription: "You cherish bittersweet emotional resonance, hand-drawn pastoral landscapes, magical realism, and the gentle melancholy of passing time.",
      tasteDna: {
        genres: [
          { name: "Magical Realism / Anime", percentage: 50 },
          { name: "Bittersweet Drama", percentage: 30 },
          { name: "Surrealist Fantasy", percentage: 20 }
        ],
        themes: ["Fleeting Childhood & Memory", "Connection with Nature & Spirits", "Dream Logic & Subjective Reality"],
        directors: ["Hayao Miyazaki", "Satoshi Kon", "Makoto Shinkai", "Isao Takahata"],
        pacingPreference: "Gentle, contemplative breaths ('Ma') punctuated by enchanting wonder",
        visualStyle: "Lush watercolor skies, vibrant foliage, detailed culinary animation"
      },
      capturedSignalsSummary: {
        totalEvents: 3,
        youtubeHighlights: ["Studio Ghibli comfort food breakdown #shorts", "Satoshi Kon Editing Time & Space video essay"],
        searchHighlights: ["Searched for bittersweet nostalgia cinema"],
        pirateStreamHighlights: ["No pirate streams logged (prefers high quality animation streaming)"],
        hiddenAffinitiesFound: "Deep appreciation for non-linear match cuts and magical realism."
      },
      recommendations: [
        {
          id: 'rec-an-1',
          title: 'Millennium Actress',
          year: 2001,
          director: 'Satoshi Kon',
          matchScore: 98,
          genres: ['Animation', 'Drama', 'Romance'],
          posterDescription: 'An aging movie star recounting her elusive lifelong search across overlapping cinema eras.',
          backdropGradient: 'from-amber-950 via-rose-900 to-black',
          overview: 'Two documentary filmmakers interview a retired actress and discover her real-life search for an enigmatic rebel has blended with every film role she ever played.',
          whyItMatched: 'Directly linked to your video essay watch on Satoshi Kon match cuts.',
          triggerSignals: ['YouTube: Satoshi Kon Editing Essay'],
          mood: 'Lyrical & Breathtaking',
          rating: '7.9/10 IMDb',
          runtime: '87 min',
          whereToWatch: ['Apple TV', 'Prime Video'],
          isUndergroundGem: true
        }
      ]
    }
  }
};

  archetypeDescription: "You gravitate towards mind-bending narratives with unreliable narrators, high existential tension, and meticulously framed cinematography. Your viewing habits show an insatiable appetite for decoding complex plots right after watching.",
  tasteDna: {
    genres: [
      { name: "Psychological Thriller", percentage: 38 },
      { name: "Sci-Fi / Neo-Noir", percentage: 28 },
      { name: "Cerebral Mystery", percentage: 20 },
      { name: "Dark Drama", percentage: 14 }
    ],
    themes: [
      "Unreliable Narrators & Memory Distortion",
      "Dystopian Megastructures & Moral Ambiguity",
      "Existential Dread & High Stakes",
      "Philosophical Identity Crises"
    ],
    directors: ["Denis Villeneuve", "Christopher Nolan", "David Fincher", "Alex Garland", "Bong Joon-ho"],
    pacingPreference: "Methodical slow-burn with explosive third-act revelations",
    visualStyle: "High-contrast chiaroscuro, desaturated brutalist palettes, anamorphic lens flares"
  },
  capturedSignalsSummary: {
    totalEvents: 10,
    youtubeHighlights: [
      "Watched deep-dive video essays on Denis Villeneuve's audio-visual tension and David Fincher's shot blocking",
      "Binged timeline breakdown of 'Primer' and philosophical analysis of 'Enemy'"
    ],
    searchHighlights: [
      "Searched Reddit for 'movies with unreliable narrator and shocking plot twist'",
      "Explored Letterboxd neo-noir collections from 2010 to 2024"
    ],
    pirateStreamHighlights: [
      "Captured unindexed stream of Kiyoshi Kurosawa's hypnotic 1997 psychological horror 'Cure' on Fmovies",
      "Logged midnight streams of Bong Joon-ho's 'Memories of Murder' and Lee Chang-dong's 'Burning' on 3rd-party lockers"
    ],
    hiddenAffinitiesFound: "Your underground stream captures reveal a sophisticated appetite for East Asian neo-noir and existential dread that standard subscription streaming recommenders completely overlook."
  },
  recommendations: [
    {
      id: "rec-1",
      title: "Incendies",
      year: 2010,
      director: "Denis Villeneuve",
      matchScore: 98,
      genres: ["Mystery", "Drama", "War"],
      posterDescription: "A haunting portrait in dusty sepia tones of twin siblings uncovering their mother's harrowing past in the Middle East.",
      backdropGradient: "from-amber-950 via-stone-900 to-black",
      overview: "Twin siblings travel to the Middle East to fulfill their late mother's final testament and uncover a tangled, shattering family secret that redefines everything they know.",
      whyItMatched: "Explicit match: Triggered by your YouTube video essay binge on Villeneuve's tension design, combined with your search for 'shocking twist endings like Prisoners'.",
      triggerSignals: ["YouTube: Villeneuve Tension Mastery Essay", "Search: 'unreliable narrator shocking twist reddit'"],
      mood: "Devastating & Masterful",
      rating: "8.3/10 IMDb",
      runtime: "131 min",
      whereToWatch: ["Prime Video", "Apple TV", "Kanopy"],
      isUndergroundGem: false
    },
    {
      id: "rec-2",
      title: "Cure (Kyua)",
      year: 1997,
      director: "Kiyoshi Kurosawa",
      matchScore: 96,
      genres: ["Psychological Horror", "Crime", "Mystery"],
      posterDescription: "Atmospheric, rain-soaked Tokyo police procedural dealing with hypnotic amnesia and ritualistic murder.",
      backdropGradient: "from-emerald-950 via-slate-900 to-black",
      overview: "A wave of grisly murders is committed by ordinary people with no memory of their actions. An exhausted detective tracks an enigmatic amnesiac wanderer who leaves hypnotic chaos in his wake.",
      whyItMatched: "Explicit match: Your underground streaming history logged a late-night stream of Cure on Fmovies. Plotted uses this to anchor your deep psychological dread vector.",
      triggerSignals: ["Pirate Stream: Fmovies stream detected", "Search: 'atmospheric psychological crime like Se7en'"],
      mood: "Hypnotic & Chilling",
      rating: "7.8/10 IMDb",
      runtime: "111 min",
      whereToWatch: ["Criterion Channel", "MUBI", "Tubi (Free)"],
      isUndergroundGem: true
    },
    {
      id: "rec-3",
      title: "Coherence",
      year: 2013,
      director: "James Ward Byrkit",
      matchScore: 95,
      genres: ["Sci-Fi", "Mystery", "Thriller"],
      posterDescription: "A cozy dinner party bathed in eerie green emergency glow as parallel realities begin to overlap outside.",
      backdropGradient: "from-cyan-950 via-slate-900 to-black",
      overview: "On the night of an astronomical anomaly, eight friends at a dinner party experience a troubling chain of reality-bending events when a neighboring house turns out to be identical to their own.",
      whyItMatched: "Explicit match: Plotted connected your 24-minute YouTube watch of the 'Primer Timeline Explained' video essay directly to Byrkit's improvisational multiverse puzzle.",
      triggerSignals: ["YouTube: Primer timeline breakdown", "Search: 'best indie sci fi puzzle movies'"],
      mood: "Paranoid & Mind-bending",
      rating: "7.2/10 IMDb",
      runtime: "89 min",
      whereToWatch: ["Prime Video", "Pluto TV (Free)", "Tubi (Free)"],
      isUndergroundGem: true
    },
    {
      id: "rec-4",
      title: "Decision to Leave",
      year: 2022,
      director: "Park Chan-wook",
      matchScore: 93,
      genres: ["Neo-Noir", "Romance", "Mystery"],
      posterDescription: "Waves crashing against sea cliffs with poetic, hyper-stylized modern noir detective aesthetics.",
      backdropGradient: "from-indigo-950 via-slate-900 to-black",
      overview: "An insomniac detective investigating a man's mysterious death in the mountains becomes obsessively infatuated with the victim's enigmatic widow, who may be the killer.",
      whyItMatched: "Explicit match: Triggered by your underground stream capture of 'Memories of Murder' and your search for modern neo-noir lists on Letterboxd.",
      triggerSignals: ["Pirate Stream: Soap2day Korean Cinema Stream", "Search: 'best neo noir 2010 to 2024'"],
      mood: "Seductive & Obsessive",
      rating: "7.3/10 IMDb",
      runtime: "138 min",
      whereToWatch: ["MUBI", "Apple TV"],
      isUndergroundGem: false
    },
    {
      id: "rec-5",
      title: "Burning (Beoning)",
      year: 2018,
      director: "Lee Chang-dong",
      matchScore: 92,
      genres: ["Mystery", "Drama", "Thriller"],
      posterDescription: "Sunset dance against a hazy rural greenhouse landscape with subtle, smoldering menace.",
      backdropGradient: "from-rose-950 via-neutral-900 to-black",
      overview: "An aspiring young writer encounters a childhood friend who returns from Africa with a wealthy, mysterious playboy who confesses to a peculiar, destructive secret hobby.",
      whyItMatched: "Explicit match: Captured on your Bflix streaming activity. Plotted analyzed the Murakami literary DNA and high-tension character study.",
      triggerSignals: ["Pirate Stream: Bflix Web Player capture", "YouTube: Video essay on visual ambiguity in cinema"],
      mood: "Smoldering & Enigmatic",
      rating: "7.5/10 IMDb",
      runtime: "148 min",
      whereToWatch: ["Prime Video", "Kanopy", "Tubi (Free)"],
      isUndergroundGem: true
    }
  ]
};
