export interface CandidateFilm {
  id: string;
  title: string;
  year: number;
  director: string;
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

export interface ScoredRecommendation extends CandidateFilm {
  matchScore: number;
  scoreBreakdown: {
    genreScore: number;
    themeScore: number;
    directorScore: number;
    behavioralScore: number;
    noveltyScore: number;
    contextScore: number;
  };
  whyItMatched: string;
  triggerSignals: string[];
  mood: string;
}

export class RankingService {
  /**
   * Deterministic mathematical scoring model
   * Weight breakdown:
   * 0.30 x Genre Similarity
   * 0.20 x Theme Similarity
   * 0.15 x Director Affinity
   * 0.15 x Behavioral History Signal Match
   * 0.10 x Novelty / Underground Vector
   * 0.10 x Context / Mood Fit
   */
  static calculateCandidateScore(
    candidate: CandidateFilm,
    userGenres: Array<{ name: string; percentage: number }>,
    userThemes: string[],
    userDirectors: string[],
    behavioralSignals: string[],
    activeMood?: string
  ): { score: number; breakdown: ScoredRecommendation['scoreBreakdown'] } {
    // 1. Genre similarity (0 to 100)
    let genreScore = 0;
    const totalUserPct = userGenres.reduce((acc, g) => acc + g.percentage, 0) || 100;
    for (const g of candidate.genres) {
      const match = userGenres.find(ug => ug.name.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(ug.name.toLowerCase()));
      if (match) {
        genreScore += (match.percentage / totalUserPct) * 100;
      }
    }
    genreScore = Math.min(100, Math.max(40, genreScore * 1.8));

    // 2. Theme similarity (0 to 100)
    let themeMatches = 0;
    for (const ct of candidate.themes) {
      if (userThemes.some(ut => ut.toLowerCase().includes(ct.toLowerCase()) || ct.toLowerCase().includes(ut.toLowerCase()))) {
        themeMatches++;
      }
    }
    const themeScore = Math.min(100, 50 + (themeMatches * 20));

    // 3. Director affinity (0 to 100)
    const hasDirector = userDirectors.some(ud => ud.toLowerCase() === candidate.director.toLowerCase());
    const directorScore = hasDirector ? 98 : 72;

    // 4. Behavioral history signal correlation (0 to 100)
    let behavioralHits = 0;
    const candidateKeywords = [candidate.title, candidate.director, ...candidate.genres, ...candidate.themes].map(k => k.toLowerCase());
    for (const signal of behavioralSignals) {
      const sigLower = signal.toLowerCase();
      if (candidateKeywords.some(k => sigLower.includes(k))) {
        behavioralHits++;
      }
    }
    const behavioralScore = Math.min(100, 60 + (behavioralHits * 18));

    // 5. Novelty (encourages underground / non-mainstream discoveries)
    const noveltyScore = candidate.isUndergroundGem ? 95 : 75;

    // 6. Contextual mood relevance (0 to 100)
    let contextScore = 80;
    if (activeMood && activeMood !== 'all') {
      const moodLower = activeMood.toLowerCase();
      const fitsMood = candidate.genres.some(g => g.toLowerCase().includes(moodLower)) ||
                        candidate.themes.some(t => t.toLowerCase().includes(moodLower)) ||
                        candidate.overview.toLowerCase().includes(moodLower);
      contextScore = fitsMood ? 98 : 65;
    }

    // Weighted composite formula
    const rawScore = 
      (0.30 * genreScore) +
      (0.20 * themeScore) +
      (0.15 * directorScore) +
      (0.15 * behavioralScore) +
      (0.10 * noveltyScore) +
      (0.10 * contextScore);

    const roundedScore = Math.min(99, Math.max(82, Math.round(rawScore)));

    return {
      score: roundedScore,
      breakdown: {
        genreScore: Math.round(genreScore),
        themeScore: Math.round(themeScore),
        directorScore: Math.round(directorScore),
        behavioralScore: Math.round(behavioralScore),
        noveltyScore: Math.round(noveltyScore),
        contextScore: Math.round(contextScore)
      }
    };
  }

  /**
   * High-quality candidate film repository across psychological thriller, neo-noir, sci-fi, and international cult cinema
   */
  static getFilmRepository(): CandidateFilm[] {
    return [
      {
        id: "cand-1",
        title: "Incendies",
        year: 2010,
        director: "Denis Villeneuve",
        genres: ["Mystery", "Drama", "Psychological Thriller"],
        themes: ["Unreliable Narrators", "Family Trauma", "Shocking Revelations", "Existential Stakes"],
        pacing: "Methodical slow-burn with explosive third act",
        backdropGradient: "from-amber-950 via-stone-900 to-black",
        overview: "Twin siblings journey to the Middle East to fulfill their deceased mother's final instructions, uncovering an unimaginable family secret.",
        whereToWatch: ["Prime Video", "Apple TV", "Kanopy"],
        isUndergroundGem: false,
        rating: "8.3/10 IMDb",
        runtime: "131 min"
      },
      {
        id: "cand-2",
        title: "Cure (Kyua)",
        year: 1997,
        director: "Kiyoshi Kurosawa",
        genres: ["Psychological Horror", "Crime", "Mystery"],
        themes: ["Hypnotic Suggestion", "Memory Distortion", "Psychological Dread", "Existential Identity"],
        pacing: "Atmospheric, creeping dread",
        backdropGradient: "from-emerald-950 via-slate-900 to-black",
        overview: "A series of grisly murders is carried out by ordinary citizens with zero memory of their crimes. A Tokyo detective tracks an enigmatic amnesiac wanderer.",
        whereToWatch: ["Criterion Channel", "MUBI", "Tubi (Free)"],
        isUndergroundGem: true,
        rating: "7.8/10 IMDb",
        runtime: "111 min"
      },
      {
        id: "cand-3",
        title: "Coherence",
        year: 2013,
        director: "James Ward Byrkit",
        genres: ["Sci-Fi", "Mystery", "Psychological Thriller"],
        themes: ["Quantum Multiverse", "Paranoia", "Doppelgangers", "Low-budget Mindfuck"],
        pacing: "Rapidly escalating chamber piece",
        backdropGradient: "from-cyan-950 via-slate-900 to-black",
        overview: "Eight friends at a dinner party experience reality-fracturing anomalies as a passing comet splinters their house across infinite parallel timelines.",
        whereToWatch: ["Prime Video", "Pluto TV (Free)", "Tubi (Free)"],
        isUndergroundGem: true,
        rating: "7.2/10 IMDb",
        runtime: "89 min"
      },
      {
        id: "cand-4",
        title: "Decision to Leave",
        year: 2022,
        director: "Park Chan-wook",
        genres: ["Neo-Noir", "Mystery", "Romance"],
        themes: ["Obsessive Investigation", "Ambiguous Guilt", "Poetic Chiaroscuro", "Insomnia"],
        pacing: "Meticulous, lyrical detective procedural",
        backdropGradient: "from-indigo-950 via-slate-900 to-black",
        overview: "An insomniac detective investigating a climber's fall develops a dangerously consuming infatuation with the dead man's mysterious widow.",
        whereToWatch: ["MUBI", "Apple TV"],
        isUndergroundGem: false,
        rating: "7.3/10 IMDb",
        runtime: "138 min"
      },
      {
        id: "cand-5",
        title: "Burning (Beoning)",
        year: 2018,
        director: "Lee Chang-dong",
        genres: ["Mystery", "Drama", "Psychological Thriller"],
        themes: ["Class Envy", "Uncertain Truth", "Murakami Aesthetics", "Smoldering Menace"],
        pacing: "Deliberate slow-burn with lingering mystery",
        backdropGradient: "from-rose-950 via-neutral-900 to-black",
        overview: "An aspiring novelist reconnects with a childhood acquaintance who returns from trip abroad with an enigmatic Gatsby-like figure possessing a sinister hobby.",
        whereToWatch: ["Prime Video", "Kanopy", "Tubi (Free)"],
        isUndergroundGem: true,
        rating: "7.5/10 IMDb",
        runtime: "148 min"
      },
      {
        id: "cand-6",
        title: "Memories of Murder",
        year: 2003,
        director: "Bong Joon-ho",
        genres: ["Crime", "Drama", "Mystery"],
        themes: ["Unsolved Mystery", "Police Incompetence", "Obsessive Decay", "Historical Turmoil"],
        pacing: "Gripping procedural blending grim satire and tension",
        backdropGradient: "from-amber-900 via-neutral-900 to-black",
        overview: "Two unequipped rural detectives and a metropolitan investigator struggle to catch Korea's first documented serial killer in 1986.",
        whereToWatch: ["Criterion Channel", "Prime Video", "Hulu"],
        isUndergroundGem: false,
        rating: "8.1/10 IMDb",
        runtime: "132 min"
      }
    ];
  }
}
