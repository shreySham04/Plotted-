import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RankingService } from '../server/services/ranking.service';

describe('RankingService', () => {
  it('computes cosine vector similarity between text documents', () => {
    const textA = 'Denis Villeneuve psychological thriller mind-bending tension';
    const textB = 'Denis Villeneuve directing high tension psychological mystery';
    const simHigh = RankingService.computeVectorSimilarity(textA, textB);

    assert.ok(simHigh > 0.5, `Expected high similarity, got ${simHigh}`);

    const textC = 'Animated comedy musical cartoon for toddlers';
    const simLow = RankingService.computeVectorSimilarity(textA, textC);

    assert.ok(simLow < 0.2, `Expected very low similarity, got ${simLow}`);
  });

  it('calculates deterministic candidate score with natural distribution', () => {
    const candidate = {
      id: 'cand-1',
      title: 'Incendies',
      year: 2010,
      director: 'Denis Villeneuve',
      genres: ['Mystery', 'Drama', 'Psychological Thriller'],
      themes: ['Unreliable Narrators', 'Shocking Revelations'],
      pacing: 'Methodical slow-burn',
      backdropGradient: 'from-amber-950 via-stone-900 to-black',
      overview: 'Twin siblings journey to the Middle East, uncovering a family secret.',
      whereToWatch: ['Prime Video'],
      isUndergroundGem: false,
      rating: '8.3/10 IMDb',
      runtime: '131 min'
    };

    const userGenres = [
      { name: 'Psychological Thriller', percentage: 40 },
      { name: 'Sci-Fi', percentage: 30 },
      { name: 'Mystery', percentage: 30 }
    ];
    const userThemes = ['Unreliable Narrators', 'Shocking Revelations', 'Dystopian Megastructures'];
    const userDirectors = ['Denis Villeneuve', 'Christopher Nolan'];
    const userSignals = ['Denis Villeneuve video essay', 'movies with plot twist'];

    const result = RankingService.calculateCandidateScore(
      candidate,
      userGenres,
      userThemes,
      userDirectors,
      userSignals
    );

    assert.ok(result.score >= 70 && result.score <= 99, `Expected score in 70-99 range, got ${result.score}`);
    assert.equal(typeof result.breakdown.genreScore, 'number');
    assert.equal(typeof result.breakdown.directorScore, 'number');
    assert.equal(result.breakdown.directorScore, 98); // Matches favorite director!
  });

  it('produces lower score for candidates with zero director or genre overlap', () => {
    const mismatchedCandidate = {
      id: 'cand-mismatch',
      title: 'Lighthearted Romcom',
      year: 2023,
      director: 'Unknown Director',
      genres: ['Romantic Comedy'],
      themes: ['Wedding Planning', 'Slapstick Humor'],
      pacing: 'Fast breezey',
      backdropGradient: 'from-pink-900 to-black',
      overview: 'Two strangers plan a funny wedding in New York.',
      whereToWatch: ['Hulu'],
      isUndergroundGem: false,
      rating: '5.5/10 IMDb',
      runtime: '95 min'
    };

    const userGenres = [{ name: 'Psychological Thriller', percentage: 100 }];
    const userThemes = ['Existential Dread', 'Memory Distortion'];
    const userDirectors = ['Denis Villeneuve', 'David Fincher'];
    const userSignals = ['mindfuck endings explained'];

    const result = RankingService.calculateCandidateScore(
      mismatchedCandidate,
      userGenres,
      userThemes,
      userDirectors,
      userSignals
    );

    // Should NOT be clamped to 82%; should naturally reflect low match score
    assert.ok(result.score < 50, `Expected low match score for mismatched film, got ${result.score}`);
  });
});
