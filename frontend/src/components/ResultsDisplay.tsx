import React from 'react';
import type { EvaluationResponse } from '../types/evaluation';
import { TrendingUp, TrendingDown, Target, Users } from 'lucide-react';

interface ResultsDisplayProps {
  results: EvaluationResponse[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (results.length === 0) return null;

  // Order resumes based on score (descending)
  const sortedResults = [...results].sort((a, b) => b.Overall_Score - a.Overall_Score);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h2 className="title-main" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Match <span className="gradient-text">Insights</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>AI analysis of {results.length} profiles</p>
        </div>
        <div className="glass-card" style={{ padding: '0.5rem 1rem', borderRadius: '100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700 }}>
            <Users size={14} className="gradient-text" />
            <span>TOP PICK: <span className="gradient-text">{sortedResults[0].Candidate_Source}</span></span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {sortedResults.map((result, index) => (
          <div key={index} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header / Score Section */}
            <div style={{ 
              padding: '1.5rem 2rem', 
              background: 'linear-gradient(to right, rgba(255,255,255,0.8), transparent)',
              borderBottom: '1px solid rgba(0,0,0,0.03)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '16px', 
                  background: 'white', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: getScoreColor(result.Overall_Score)
                }}>
                  {result.Overall_Score}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.1rem', color: 'var(--text-primary)' }}>{result.Candidate_Source}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="badge badge-success" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', padding: '0.2rem 0.6rem' }}>
                      {result.Role_Classification}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      <Target size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      Prob: {result.Confidence_Level}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="animate-fade-in" style={{ padding: '0.75rem 1.5rem', background: '#0f172a', color: 'white', borderRadius: '14px', fontWeight: 600, fontSize: '0.9rem' }}>
                  {result.Recommendation}
                </div>
              </div>
            </div>

            {/* Analysis Grid */}
            <div style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <TrendingUp size={18} style={{ color: '#10b981' }} />
                  Advantages
                </h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {result.Strengths.map((s, i) => (
                    <div key={i} className="result-card" style={{ padding: '0.75rem 1rem', borderLeft: '3px solid #10b981' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <TrendingDown size={18} style={{ color: '#ef4444' }} />
                  Gaps & Risks
                </h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {[...result.Gaps, ...result.Risk_Flags].map((g, i) => (
                    <div key={i} className="result-card" style={{ padding: '0.75rem 1rem', borderLeft: '3px solid #ef4444' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4 }}>{g}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getScoreColor(score: number) {
  if (score >= 80) return '#4ade80';
  if (score >= 60) return '#fbbf24';
  return '#fb7185';
}

export default ResultsDisplay;
