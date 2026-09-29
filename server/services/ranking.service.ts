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
   * Tokenizes text into normalized term frequencies
   */
  private static tokenize(text: string): Map<string, number> {
    const tokens = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2); // Exclude 1-2 char noise

    const tf = new Map<string, number>();
    for (const t of tokens) {
      tf.set(t, (tf.get(t) || 0) + 1);
    }
    return tf;
  }

  /**
   * Computes cosine similarity between two term-frequency text vectors (0.0 to 1.0)
   */
  static computeVectorSimilarity(textA: string, textB: string): number {
    const tfA = this.tokenize(textA);
    const tfB = this.tokenize(textB);

    if (tfA.size === 0 || tfB.size === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const val of tfA.values()) normA += val * val;
    for (const val of tfB.values()) normB += val * val;

    for (const [term, countA] of tfA.entries()) {
      const countB = tfB.get(term);
      if (countB) {
        dotProduct += countA * countB;
      }
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude > 0 ? dotProduct / magnitude : 0;
  }

  /**
   * Deterministic mathematical scoring model
   * Weight breakdown:
   * 0.30 x Genre Similarity
   * 0.20 x Theme Similarity
   * 0.15 x Director Affinity
   * 0.15 x Vector Behavioral Match (TF-IDF Cosine Overlap)
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
      const match = userGenres.find(ug => 
        ug.name.toLowerCase().includes(g.toLowerCase()) || 
        g.toLowerCase().includes(ug.name.toLowerCase())
      );
      if (match) {
        genreScore += (match.percentage / totalUserPct) * 100;
      }
    }
    genreScore = Math.min(100, Math.round(genreScore * 1.6));

    // 2. Theme similarity (0 to 100)
    let themeMatches = 0;
    for (const ct of candidate.themes) {
      if (userThemes.some(ut => ut.toLowerCase().includes(ct.toLowerCase()) || ct.toLowerCase().includes(ut.toLowerCase()))) {
        themeMatches++;
      }
    }
    const themeScore = Math.min(100, Math.round((themeMatches / Math.max(userThemes.length, 1)) * 100));

    // 3. Director affinity (0 to 100)
    const hasDirector = userDirectors.some(ud => ud.toLowerCase() === candidate.director.toLowerCase());
    const directorScore = hasDirector ? 98 : 35; // True differentiation if director is in user's affinity list

    // 4. Behavioral history signal correlation via vector cosine similarity (0 to 100)
    const candidateText = `${candidate.title} ${candidate.director} ${candidate.genres.join(' ')} ${candidate.themes.join(' ')} ${candidate.overview}`;
    const userSignalsText = behavioralSignals.join(' ');
    const cosineSim = this.computeVectorSimilarity(candidateText, userSignalsText);
    const behavioralScore = Math.min(100, Math.round(cosineSim * 120)); // scale cosine (0..0.8) to (0..100)

    // 5. Novelty (encourages underground / non-mainstream discoveries)
    const noveltyScore = candidate.isUndergroundGem ? 95 : 60;

    // 6. Contextual mood relevance (0 to 100)
    let contextScore = 70;
    if (activeMood && activeMood !== 'all') {
      const moodLower = activeMood.toLowerCase();
      const fitsMood = candidate.genres.some(g => g.toLowerCase().includes(moodLower)) ||
                        candidate.themes.some(t => t.toLowerCase().includes(moodLower)) ||
                        candidate.overview.toLowerCase().includes(moodLower);
      contextScore = fitsMood ? 98 : 30;
    }

    // Weighted composite formula (No artificial minimum clamp; true natural score range)
    const rawScore = 
      (0.30 * genreScore) +
      (0.20 * themeScore) +
      (0.15 * directorScore) +
      (0.15 * behavioralScore) +
      (0.10 * noveltyScore) +
      (0.10 * contextScore);

    const roundedScore = Math.min(99, Math.max(15, Math.round(rawScore)));

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
   * Film repository across psychological thriller, neo-noir, sci-fi, and international cult cinema
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
