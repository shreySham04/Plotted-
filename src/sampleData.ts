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

export const INITIAL_TASTE_PROFILE: TasteProfile = {
  tasteArchetype: "The Existential Puzzle-Solver & Neo-Noir Seeker",
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
