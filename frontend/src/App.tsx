import { useState } from 'react'
import './App.css'
import UploadSection from './components/UploadSection'
import ResultsDisplay from './components/ResultsDisplay'
import type { EvaluationResponse } from './types/evaluation'
import { Sparkles, Briefcase, Users } from 'lucide-react'

function App() {
  const [results, setResults] = useState<EvaluationResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEvaluate = async (jd: string, resumes: File[]) => {
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('job_description', jd)
    resumes.forEach(file => {
      formData.append('resumes', file)
    })

    try {
      const response = await fetch('http://localhost:8000/evaluate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      console.error('Evaluation failed:', err)
      setError('Failed to connect to the evaluation API. Please ensure the backend server is running on port 8000.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '1rem' }}>
          <div className="animate-fade-in" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            backgroundColor: 'white',
            padding: '0.4rem 1rem',
            borderRadius: '100px',
            color: 'var(--accent-primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            <Sparkles size={14} />
            Lumina Intelligence
          </div>
          <h1 className="title-main animate-fade-in" style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
            Resume <span className="gradient-text">Evaluator</span>
          </h1>
          <p className="animate-fade-in" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', fontWeight: 500, lineHeight: 1.5 }}>
            AI-driven candidate ranking and skills analysis.
          </p>
        </header>

        <main>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: results.length > 0 ? '400px 1fr' : '1fr', 
            gap: '2rem', 
            alignItems: 'start' 
          }}>
            <UploadSection onEvaluate={handleEvaluate} isLoading={isLoading} />
            
            {error && (
              <div className="glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
                <Users size={48} style={{ color: '#ef4444', marginBottom: '1.5rem', opacity: 0.6 }} />
                <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
              </div>
            )}

            {!error && results.length === 0 && !isLoading && (
              <div className="glass-card animate-fade-in" style={{ padding: '6rem 3rem', textAlign: 'center', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="float">
                  <Briefcase size={80} style={{ color: 'var(--accent-primary)', marginBottom: '2rem', opacity: 0.15 }} />
                </div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 700 }}>Ready to analyze</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '350px', lineHeight: 1.6 }}>
                  Upload your job requirements and candidate resumes to see the Lumina ranking system in action.
                </p>
              </div>
            )}

            {results.length > 0 && <ResultsDisplay results={results} />}
          </div>
        </main>

        <footer style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <p style={{ fontWeight: 500 }}>&copy; 2026 Lumina AI • Engineered for Excellence</p>
        </footer>
      </div>
    </>
  )
}

export default App
