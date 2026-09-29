import { CandidateContent, CatalogService } from './catalog.service';

export type CandidateFilm = CandidateContent;

export interface ScoredRecommendation extends CandidateContent {
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

    // 3. Director/Creator affinity (0 to 100)
    const hasDirectorOrCreator = userDirectors.some(ud => {
      const matchDir = ud.toLowerCase() === candidate.director.toLowerCase();
      const matchCreator = candidate.creator && ud.toLowerCase() === candidate.creator.toLowerCase();
      return matchDir || matchCreator;
    });
    const directorScore = hasDirectorOrCreator ? 98 : 35; // True differentiation if director/creator is in user's affinity list

    // 4. Behavioral history signal correlation via vector cosine similarity (0 to 100)
    const candidateText = `${candidate.title} ${candidate.director} ${candidate.creator || ''} ${candidate.genres.join(' ')} ${candidate.themes.join(' ')} ${candidate.overview}`;
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

    // Weighted composite formula (Deterministic multi-feature vector)
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
   * Retrieves full catalog across movies and television series
   */
  static getContentRepository(): CandidateContent[] {
    return CatalogService.getFullCatalog();
  }

  /**
   * Backwards-compatible alias for getContentRepository
   */
  static getFilmRepository(): CandidateContent[] {
    return this.getContentRepository();
  }
}
