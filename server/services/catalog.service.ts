export interface CandidateContent {
  id: string;
  title: string;
  mediaType: 'movie' | 'series';
  seasons?: string;
  year: number;
  director: string;
  creator?: string;
  genres: string[];
  themes: string[];
  pacing: string;
  backdropGradient: string;
  overview: string;
  whereToWatch: string[];
  isUndergroundGem: boolean;
  rating: string;
  runtime: string;
}

export class CatalogService {
  /**
   * Comprehensive, multi-domain cinematic & television content catalog
   * Covers Anime, Hard Sci-Fi, Psychological Thriller, Neo-Noir, Crime, Drama, Horror, and World Cinema
   */
  private static readonly CONTENT_CATALOG: CandidateContent[] = [
    // --- ANIME & ANIMATION (Feature Films & Series) ---
    {
      id: "cat-anime-1",
      title: "Princess Mononoke",
      mediaType: "movie",
      year: 1997,
      director: "Hayao Miyazaki",
      genres: ["Anime", "Fantasy", "Adventure", "Drama"],
      themes: ["Environmental Harmony", "Morality of War", "Nature vs Progress", "Curse & Redemption"],
      pacing: "Epic and sweeping narrative with contemplative interludes",
      backdropGradient: "from-emerald-950 via-teal-900 to-black",
      overview: "A cursed young Emishi prince travels to the sacred western forests, finding himself caught in an escalating conflict between an industrial iron outpost and animal gods of the wild.",
      whereToWatch: ["Max", "Prime Video", "Apple TV"],
      isUndergroundGem: false,
      rating: "8.4/10 IMDb",
      runtime: "134 min"
    },
    {
      id: "cat-anime-2",
      title: "Attack on Titan",
      mediaType: "series",
      seasons: "4 Seasons",
      year: 2013,
      director: "Tetsurō Araki",
      creator: "Hajime Isayama",
      genres: ["Anime", "Dark Fantasy", "Action", "Psychological Thriller"],
      themes: ["Cycle of Retaliation", "Freedom vs Fascism", "Morality of War", "Nihilism & Duty"],
      pacing: "High-octane intensity with complex non-linear revelations",
      backdropGradient: "from-amber-950 via-red-950 to-black",
      overview: "After his hometown is destroyed and his mother is killed by giant humanoid Titans, Eren Jaeger vows to cleanse the earth of Titans, only to uncover horrifying geopolitical truths.",
      whereToWatch: ["Crunchyroll", "Hulu", "Netflix"],
      isUndergroundGem: false,
      rating: "9.1/10 IMDb",
      runtime: "87 eps • 24m"
    },
    {
      id: "cat-anime-3",
      title: "Spirited Away",
      mediaType: "movie",
      year: 2001,
      director: "Hayao Miyazaki",
      genres: ["Anime", "Fantasy", "Adventure"],
      themes: ["Childhood Autonomy", "Greed vs Identity", "Supernatural Folklore", "Sensory Wonder"],
      pacing: "Dreamlike, wondrous, and deeply atmospheric",
      backdropGradient: "from-rose-950 via-purple-950 to-black",
      overview: "Ten-year-old Chihiro wanders into a secret world of Kami and spirits where her parents are transformed into pigs. She must labor at a supernatural bathhouse to earn their freedom.",
      whereToWatch: ["Max", "Apple TV"],
      isUndergroundGem: false,
      rating: "8.6/10 IMDb",
      runtime: "125 min"
    },
    {
      id: "cat-anime-4",
      title: "Perfect Blue",
      mediaType: "movie",
      year: 1997,
      director: "Satoshi Kon",
      genres: ["Anime", "Psychological Thriller", "Mystery", "Horror"],
      themes: ["Fractured Persona", "Male Gaze & Parasocial Stalking", "Surreal Reality Distortion", "Celebrity Identity"],
      pacing: "Dizzying, rapid-fire psychological disorientation",
      backdropGradient: "from-blue-950 via-indigo-950 to-black",
      overview: "A former pop idol transitions into acting on a grim crime TV series, but the psychological strain and a violent stalker cause her reality to blur into a terrifying nightmare.",
      whereToWatch: ["Shudder", "Tubi (Free)", "Kanopy"],
      isUndergroundGem: true,
      rating: "8.0/10 IMDb",
      runtime: "81 min"
    },
    {
      id: "cat-anime-5",
      title: "Arcane",
      mediaType: "series",
      seasons: "2 Seasons",
      year: 2021,
      director: "Pascal Charrue & Arnaud Delord",
      creator: "Christian Linke & Alex Yee",
      genres: ["Animation", "Sci-Fi", "Action", "Steampunk Drama"],
      themes: ["Class Warfare", "Sisterhood Severed", "Technological hubris", "Trauma & Radicalization"],
      pacing: "Electrifying, kinetic, and emotionally devastating",
      backdropGradient: "from-blue-950 via-fuchsia-950 to-black",
      overview: "Set in the utopian region of Piltover and the oppressed underground of Zaun, two sisters fight on rival sides of a war between twisted technologies and incompatible convictions.",
      whereToWatch: ["Netflix"],
      isUndergroundGem: false,
      rating: "9.0/10 IMDb",
      runtime: "18 eps • 40m"
    },
    {
      id: "cat-anime-6",
      title: "Akira",
      mediaType: "movie",
      year: 1988,
      director: "Katsuhiro Otomo",
      genres: ["Anime", "Cyberpunk", "Sci-Fi", "Action"],
      themes: ["Government Corruption", "Unchecked Psychic Power", "Post-Nuclear Trauma", "Body Horror"],
      pacing: "Explosive, apocalyptic spectacle",
      backdropGradient: "from-red-950 via-neutral-900 to-black",
      overview: "In dystopian Neo-Tokyo 2019, a secret military project transforms a biker gang member into a rampaging psychic demigod, threatening the rebuilt metropolis with annihilation.",
      whereToWatch: ["Hulu", "Prime Video"],
      isUndergroundGem: false,
      rating: "8.0/10 IMDb",
      runtime: "124 min"
    },
    {
      id: "cat-anime-7",
      title: "Cyberpunk: Edgerunners",
      mediaType: "series",
      seasons: "Limited Series",
      year: 2022,
      director: "Hiroyuki Imaishi",
      creator: "Studio Trigger",
      genres: ["Anime", "Cyberpunk", "Sci-Fi", "Action"],
      themes: ["Cyberware Addiction", "Hyper-Capitalist Brutality", "Ephemeral Romance", "Glory vs Survival"],
      pacing: "Frenetic, neon-soaked, visceral velocity",
      backdropGradient: "from-yellow-950 via-neutral-900 to-black",
      overview: "A talented street kid in Night City loses everything and chooses to survive as an edgerunner—a mercenary outlaw taking on high-risk corporate heists.",
      whereToWatch: ["Netflix"],
      isUndergroundGem: false,
      rating: "8.3/10 IMDb",
      runtime: "10 eps • 24m"
    },

    // --- SCI-FI, SPACE & TEMPORAL PUZZLES (Feature Films & Series) ---
    {
      id: "cat-scifi-1",
      title: "Interstellar",
      mediaType: "movie",
      year: 2014,
      director: "Christopher Nolan",
      genres: ["Sci-Fi", "Adventure", "Drama"],
      themes: ["Relativistic Time Dilation", "Black Holes & Gravity", "Father-Daughter Bond", "Planetary Extinction"],
      pacing: "Monumental, majestic build-up with grand cosmic stakes",
      backdropGradient: "from-amber-950 via-slate-900 to-black",
      overview: "When Earth becomes uninhabitable, a team of ex-NASA astronauts travels through a newly appeared wormhole near Saturn in search of a viable sanctuary for mankind.",
      whereToWatch: ["Paramount+", "Prime Video"],
      isUndergroundGem: false,
      rating: "8.7/10 IMDb",
      runtime: "169 min"
    },
    {
      id: "cat-scifi-2",
      title: "Dark",
      mediaType: "series",
      seasons: "3 Seasons",
      year: 2017,
      director: "Baran bo Odar",
      creator: "Baran bo Odar & Jantje Friese",
      genres: ["Sci-Fi", "Mystery", "Supernatural Thriller", "Drama"],
      themes: ["Causal Time Loops", "Generational Guilt", "Predetermined Fate", "Nuclear Dread"],
      pacing: "Methodical, deeply intricate multi-timeline puzzle",
      backdropGradient: "from-yellow-950 via-stone-900 to-black",
      overview: "The disappearance of two children in a German town unearths sinister family secrets and a bizarre four-generation time travel conspiracy centered beneath the local nuclear plant.",
      whereToWatch: ["Netflix"],
      isUndergroundGem: false,
      rating: "8.7/10 IMDb",
      runtime: "26 eps • 60m"
    },
    {
      id: "cat-scifi-3",
      title: "Severance",
      mediaType: "series",
      seasons: "2 Seasons",
      year: 2022,
      director: "Ben Stiller & Aoife McArdle",
      creator: "Dan Erickson",
      genres: ["Sci-Fi", "Psychological Thriller", "Mystery", "Black Comedy"],
      themes: ["Corporate Dystopia", "Dissociated Identity", "Grief & Memory Erasure", "Institutional Control"],
      pacing: "Precision slow-burn with razor-sharp suspense escalation",
      backdropGradient: "from-cyan-950 via-slate-950 to-black",
      overview: "Employees at Lumon Industries undergo a surgical procedure that cleanly divides their memories between their work lives and personal lives, until an employee uncovers a sinister conspiracy.",
      whereToWatch: ["Apple TV+"],
      isUndergroundGem: false,
      rating: "8.7/10 IMDb",
      runtime: "19 eps • 50m"
    },
    {
      id: "cat-scifi-4",
      title: "Arrival",
      mediaType: "movie",
      year: 2016,
      director: "Denis Villeneuve",
      genres: ["Sci-Fi", "Drama", "Mystery"],
      themes: ["Linguistic Relativity (Sapir-Whorf)", "Non-linear Temporality", "Global Unity", "Grief Accepted"],
      pacing: "Meditative, reverent, intellectually breathtaking",
      backdropGradient: "from-slate-950 via-neutral-900 to-black",
      overview: "Linguistics professor Louise Banks is recruited by the military to communicate with extraterrestrial beings aboard massive shell-like ships hovering over twelve international sites.",
      whereToWatch: ["Netflix", "Paramount+"],
      isUndergroundGem: false,
      rating: "7.9/10 IMDb",
      runtime: "116 min"
    },
    {
      id: "cat-scifi-5",
      title: "Devs",
      mediaType: "series",
      seasons: "Limited Series",
      year: 2020,
      director: "Alex Garland",
      creator: "Alex Garland",
      genres: ["Sci-Fi", "Mystery", "Techno-Thriller"],
      themes: ["Quantum Determinism", "Free Will vs Multiverse", "Silicon Valley Megalomania", "Messiah Complex"],
      pacing: "Hypnotic, philosophical, visually architectural",
      backdropGradient: "from-amber-950 via-zinc-900 to-black",
      overview: "A computer engineer investigates the secretive development division in her quantum computing employer, suspecting it behind the disappearance and staged death of her partner.",
      whereToWatch: ["Hulu"],
      isUndergroundGem: true,
      rating: "7.7/10 IMDb",
      runtime: "8 eps • 50m"
    },
    {
      id: "cat-scifi-6",
      title: "Coherence",
      mediaType: "movie",
      year: 2013,
      director: "James Ward Byrkit",
      genres: ["Sci-Fi", "Mystery", "Psychological Thriller"],
      themes: ["Quantum Decoherence", "Doppelgänger Paranoia", "Alternate Timelines", "Improvised Tension"],
      pacing: "Claustrophobic, rapidly spiraling dinner party anomaly",
      backdropGradient: "from-cyan-950 via-slate-900 to-black",
      overview: "During a comet flyby, eight friends at a dinner party experience reality-bending power outages, only to realize the house down the street is an alternate version of their own.",
      whereToWatch: ["Prime Video", "Tubi (Free)", "Pluto TV"],
      isUndergroundGem: true,
      rating: "7.2/10 IMDb",
      runtime: "89 min"
    },
    {
      id: "cat-scifi-7",
      title: "Solaris",
      mediaType: "movie",
      year: 1972,
      director: "Andrei Tarkovsky",
      genres: ["Sci-Fi", "Mystery", "Philosophical Drama"],
      themes: ["Sentient Oceanic Cosmos", "Memory Manifestation", "Human Inability to Comprehend the Alien", "Grief"],
      pacing: "Transcendent, poetic, monumental slow-burn",
      backdropGradient: "from-blue-950 via-slate-900 to-black",
      overview: "A psychologist is dispatched to an isolated space station orbiting the oceanic planet Solaris, discovering that the crew has been driven mad by physical manifestations of their darkest memories.",
      whereToWatch: ["Criterion Channel", "Max", "Kanopy"],
      isUndergroundGem: true,
      rating: "8.0/10 IMDb",
      runtime: "167 min"
    },

    // --- PSYCHOLOGICAL THRILLERS, NEO-NOIR & CRIME ---
    {
      id: "cat-thrill-1",
      title: "True Detective (Season 1)",
      mediaType: "series",
      seasons: "1 Season",
      year: 2014,
      director: "Cary Joji Fukunaga",
      creator: "Nic Pizzolatto",
      genres: ["Crime", "Neo-Noir", "Southern Gothic", "Mystery"],
      themes: ["Philosophical Pessimism", "Cosmic Dread & Carcosa", "Institutional Depravity", "Masculine Ruin"],
      pacing: "Sweltering, atmospheric detective odyssey across 17 years",
      backdropGradient: "from-yellow-950 via-neutral-900 to-black",
      overview: "Two Louisiana State Police detectives obsessively pursue an occult serial killer across rural bayous over a seventeen-year span that tests their sanity and moral codes.",
      whereToWatch: ["Max"],
      isUndergroundGem: false,
      rating: "8.9/10 IMDb",
      runtime: "8 eps • 60m"
    },
    {
      id: "cat-thrill-2",
      title: "Incendies",
      mediaType: "movie",
      year: 2010,
      director: "Denis Villeneuve",
      genres: ["Mystery", "Drama", "Psychological Thriller"],
      themes: ["Family Lineage", "War Horrors", "Shocking Truth Revelation", "Cycle of Hate Broken"],
      pacing: "Methodical slow-burn with devastating emotional climax",
      backdropGradient: "from-amber-950 via-stone-900 to-black",
      overview: "Twin siblings journey to the Middle East to fulfill their deceased mother's will, untangling her secret past amidst civil war and discovering an earth-shattering family truth.",
      whereToWatch: ["Prime Video", "Apple TV"],
      isUndergroundGem: false,
      rating: "8.3/10 IMDb",
      runtime: "131 min"
    },
    {
      id: "cat-thrill-3",
      title: "Cure (Kyua)",
      mediaType: "movie",
      year: 1997,
      director: "Kiyoshi Kurosawa",
      genres: ["Psychological Horror", "Crime", "Mystery"],
      themes: ["Hypnotic Suggestion", "Amnesia as Weapon", "Urban Alienation", "Latent Societal Violence"],
      pacing: "Unsettling, creeping dread without jump scares",
      backdropGradient: "from-emerald-950 via-slate-900 to-black",
      overview: "A series of bizarre murders are committed by ordinary citizens who carve an X into their victims' throats and recall nothing. A Tokyo detective tracks a mysterious amnesiac wanderer.",
      whereToWatch: ["Criterion Channel", "MUBI"],
      isUndergroundGem: true,
      rating: "7.8/10 IMDb",
      runtime: "111 min"
    },
    {
      id: "cat-thrill-4",
      title: "Mindhunter",
      mediaType: "series",
      seasons: "2 Seasons",
      year: 2017,
      director: "David Fincher",
      creator: "Joe Penhall",
      genres: ["Crime", "Psychological Thriller", "Procedural Drama"],
      themes: ["Criminal Profiling", "Psychopathic Psychology", "Interviewer Contagion", "Bureaucratic Resistance"],
      pacing: "Meticulous, dialogue-heavy psychological chess match",
      backdropGradient: "from-stone-900 via-neutral-900 to-black",
      overview: "In the late 1970s, two FBI agents pioneer the behavioral profiling of incarcerated serial killers to understand their psychology and catch active offenders.",
      whereToWatch: ["Netflix"],
      isUndergroundGem: false,
      rating: "8.6/10 IMDb",
      runtime: "19 eps • 55m"
    },
    {
      id: "cat-thrill-5",
      title: "Decision to Leave",
      mediaType: "movie",
      year: 2022,
      director: "Park Chan-wook",
      genres: ["Neo-Noir", "Mystery", "Romantic Thriller"],
      themes: ["Obsessive Surveillance", "Language & Misinterpretation", "Guilt & Longing", "Melancholy Ocean"],
      pacing: "Lyrical, impeccably edited detective procedural",
      backdropGradient: "from-indigo-950 via-slate-900 to-black",
      overview: "An insomniac homicide detective investigating a fatal mountain fall develops a dangerously consuming infatuation with the dead man's enigmatic widow.",
      whereToWatch: ["MUBI", "Apple TV"],
      isUndergroundGem: false,
      rating: "7.3/10 IMDb",
      runtime: "138 min"
    },
    {
      id: "cat-thrill-6",
      title: "Burning (Beoning)",
      mediaType: "movie",
      year: 2018,
      director: "Lee Chang-dong",
      genres: ["Mystery", "Drama", "Psychological Thriller"],
      themes: ["Class Resentment", "Murakami Ambiguity", "Sinister Malevolence", "Obsession & Vanishing"],
      pacing: "Hypnotic, slow-boil mystery drenched in existential unease",
      backdropGradient: "from-rose-950 via-neutral-900 to-black",
      overview: "An aspiring novelist reconnects with a childhood neighbor who returns from Kenya with a charming, affluent Gatsby-like figure who confesses an unsettling secret hobby.",
      whereToWatch: ["Prime Video", "Kanopy"],
      isUndergroundGem: true,
      rating: "7.5/10 IMDb",
      runtime: "148 min"
    },
    {
      id: "cat-thrill-7",
      title: "Chernobyl",
      mediaType: "series",
      seasons: "Limited Series",
      year: 2019,
      director: "Johan Renck",
      creator: "Craig Mazin",
      genres: ["Historical Drama", "Thriller", "Disaster Drama"],
      themes: ["Cost of Lies", "Institutional Corruption", "Scientific Heroism", "Invisible Radiation Horror"],
      pacing: "Suffocating tension and relentless procedural dread",
      backdropGradient: "from-slate-950 via-stone-900 to-black",
      overview: "Dramatizes the true story of the 1986 nuclear accident in the Soviet Union, the brave men and women who made unbelievable sacrifices, and the bureaucratic denial that caused it.",
      whereToWatch: ["Max"],
      isUndergroundGem: false,
      rating: "9.3/10 IMDb",
      runtime: "5 eps • 65m"
    },

    // --- HORROR & ATMOSPHERIC DREAD ---
    {
      id: "cat-horror-1",
      title: "Hereditary",
      mediaType: "movie",
      year: 2018,
      director: "Ari Aster",
      genres: ["Horror", "Psychological Thriller", "Mystery"],
      themes: ["Generational Grief", "Demonic Predestination", "Familial Trauma", "Occult Secrets"],
      pacing: "Suffocating family drama morphing into waking nightmare",
      backdropGradient: "from-red-950 via-stone-950 to-black",
      overview: "After the family matriarch passes away, a grieving family is haunted by tragic and disturbing occurrences, unraveling dark secrets and an inescapable lineage curse.",
      whereToWatch: ["Max", "Prime Video"],
      isUndergroundGem: false,
      rating: "7.3/10 IMDb",
      runtime: "127 min"
    },
    {
      id: "cat-horror-2",
      title: "The Witch",
      mediaType: "movie",
      year: 2015,
      director: "Robert Eggers",
      genres: ["Horror", "Period Mystery", "Psychological"],
      themes: ["Puritan Paranoia", "Isolation Madness", "Folklore Witchcraft", "Feminine Liberation"],
      pacing: "Creeping, atmospheric dread in candle-lit seventeenth-century wilderness",
      backdropGradient: "from-stone-950 via-neutral-900 to-black",
      overview: "In 1630 New England, a devout Puritan family is banished to the edge of an ominous forest where their newborn son vanishes, triggering paranoia and supernatural ruin.",
      whereToWatch: ["Max", "Prime Video"],
      isUndergroundGem: false,
      rating: "7.0/10 IMDb",
      runtime: "92 min"
    }
  ];

  /**
   * Retrieves all candidate content items
   */
  static getFullCatalog(): CandidateContent[] {
    return [...this.CONTENT_CATALOG];
  }

  /**
   * Filters and ranks candidates based on dynamic user queries and extracted keywords
   */
  static queryCandidates(keywords: string[], mediaType?: 'movie' | 'series'): CandidateContent[] {
    let pool = [...this.CONTENT_CATALOG];
    if (mediaType) {
      pool = pool.filter(item => item.mediaType === mediaType);
    }

    if (keywords.length === 0) return pool;

    const lowerKeywords = keywords.map(k => k.toLowerCase());

    return pool.map(item => {
      let matches = 0;
      const searchable = [
        item.title,
        item.director,
        item.creator || '',
        ...item.genres,
        ...item.themes,
        item.overview
      ].join(' ').toLowerCase();

      for (const kw of lowerKeywords) {
        if (searchable.includes(kw)) matches++;
      }

      return { item, matches };
    })
    .sort((a, b) => b.matches - a.matches)
    .map(entry => entry.item);
  }
}
