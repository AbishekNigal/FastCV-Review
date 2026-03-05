import { useState } from 'react'
import './App.css'
import UploadSection from './components/UploadSection'
import ResultsDisplay from './components/ResultsDisplay'
import type { EvaluationResponse } from './types/evaluation'
import { Users, Briefcase } from 'lucide-react';

function App() {
  const [results, setResults] = useState<EvaluationResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ total: number; current: number } | null>(null)
  const [evaluationCache] = useState(new Map<string, EvaluationResponse>())

  const handleEvaluate = async (jd: string, resumes: File[]) => {
    setIsLoading(true)
    setError(null)
    setProgress({ total: resumes.length, current: 0 })
    
    // Clear previous results only if it's a completely new batch
    // Actually, user might want to keep results, but for now we follow the 'Evaluation Setup' reset logic
    
    try {
      // Process resumes individually in parallel
      const evaluationPromises = resumes.map(async (file) => {
        // Simple client-side cache key
        const cacheKey = `${jd}_${file.name}_${file.size}`
        if (evaluationCache.has(cacheKey)) {
          const cached = evaluationCache.get(cacheKey)!
          setProgress(prev => prev ? { ...prev, current: prev.current + 1 } : null)
          return cached
        }

        const formData = new FormData()
        formData.append('job_description', jd)
        formData.append('resumes', file) // Backend accepts list, but here we send 1

        const response = await fetch('https://fastcv-review.onrender.com/evaluate', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to evaluate ${file.name}: ${response.status}`)
        }

        const data = await response.json()
        const result = data[0] // Since we sent only 1
        
        if (result.error) {
          throw new Error(result.error)
        }

        // Cache the successful result
        evaluationCache.set(cacheKey, result)
        setProgress(prev => prev ? { ...prev, current: prev.current + 1 } : null)
        return result
      })

      const resultsArray = await Promise.all(evaluationPromises)
      setResults(resultsArray)
    } catch (err: any) {
      console.error('Evaluation failed:', err)
      setError(err.message || 'Failed to connect to the evaluation API.')
    } finally {
      setIsLoading(false)
      setProgress(null)
    }
  }

  const handleReset = () => {
    setResults([])
    setError(null)
  }

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <div className="container" style={{ paddingBottom: '5rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.8rem', backgroundColor: 'white', borderRadius: '100px', width: 'fit-content', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)', margin: '0 auto' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
            <span style={{ letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>HR SKILLS POWERED</span>
          </div>
          
          <h1 className="title-main" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', lineHeight: 1.1 }}>
            FastCV <span className="gradient-text">Review</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', fontWeight: 500, margin: '0 auto' }}>
            Professional AI-powered resume evaluation and ranking.
          </p>
        </header>

        <main>
          <div style={{ 
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <UploadSection 
              onEvaluate={handleEvaluate} 
              isLoading={isLoading} 
              onClear={handleReset} 
              progress={progress}
            />
            
            {error && (
              <div className="glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
                <Users size={48} style={{ color: '#ef4444', marginBottom: '1.5rem', opacity: 0.6, margin: '0 auto' }} />
                <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
                <button 
                  onClick={handleReset}
                  className="btn-lumina"
                  style={{ marginTop: '1.5rem', backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', boxShadow: 'none' }}
                >
                  Try Again
                </button>
              </div>
            )}

            {!error && results.length === 0 && !isLoading && (
              <div className="glass-card animate-fade-in" style={{ padding: '6rem 3rem', textAlign: 'center', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                <div className="float">
                  <Briefcase size={80} style={{ color: 'var(--accent-primary)', marginBottom: '2rem', opacity: 0.15 }} />
                </div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 700 }}>Ready to analyze</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '350px', lineHeight: 1.6 }}>
                  Upload your job requirements and candidate resumes to see the FastCV ranking system in action.
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div style={{ marginTop: '4rem' }}>
                <ResultsDisplay results={results} />
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button 
                    onClick={handleReset}
                    className="btn-lumina"
                    style={{ backgroundColor: 'white', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  >
                    Start New Evaluation
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <p style={{ fontWeight: 500 }}>&copy; 2026 FastCV Review • Engineered for Excellence</p>
        </footer>
      </div>
    </>
  )
}

export default App
