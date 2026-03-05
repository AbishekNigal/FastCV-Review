import React, { useState } from 'react';
import { Upload, FileText, X, AlertCircle, Sparkles, Users } from 'lucide-react';

interface UploadSectionProps {
  onEvaluate: (jd: string, resumes: File[]) => void;
  isLoading: boolean;
  onClear: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onEvaluate, isLoading, onClear }) => {
  const [jdText, setJdText] = useState('');
  const [resumes, setResumes] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.type === 'application/pdf'
      );
      
      if (newFiles.length !== e.target.files.length) {
        setError('Some files were skipped. Only PDF files are supported.');
      } else {
        setError(null);
      }
      
      setResumes(prev => [...prev, ...newFiles]);
    }
  };

  const removeResume = (index: number) => {
    setResumes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) {
      setError('Please provide a Job Description.');
      return;
    }
    if (resumes.length === 0) {
      setError('Please upload at least one resume.');
      return;
    }
    setError(null);
    onEvaluate(jdText, resumes);
  };

  const handleClear = () => {
    setJdText('');
    setResumes([]);
    setError(null);
    onClear();
  };

  return (
    <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'var(--accent-primary)', color: 'white', padding: '0.5rem', borderRadius: '10px' }}>
            <Upload size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Evaluation Setup</h2>
        </div>
        {(jdText || resumes.length > 0) && (
          <button 
            type="button" 
            onClick={handleClear}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontSize: '0.8rem', 
              fontWeight: 600, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <X size={14} /> Clear All
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label-lumina">Job Description</label>
          <div className="input-lumina" style={{ padding: 0, overflow: 'hidden' }}>
            <textarea
              style={{ 
                width: '100%',
                minHeight: '180px', 
                resize: 'vertical',
                background: 'transparent',
                border: 'none',
                padding: '1.25rem',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '1rem',
                color: 'inherit',
                display: 'block'
              }}
              placeholder="Paste target requirements..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label-lumina">Candidate Resumes</label>
          
          <div 
            className="input-lumina"
            style={{
              border: '2px dashed rgba(99, 102, 241, 0.2)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s ease',
              backgroundColor: resumes.length > 0 ? 'rgba(99, 102, 241, 0.02)' : 'rgba(0, 0, 0, 0.02)'
            }}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.05)'; }}
            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)'; }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
              if (e.dataTransfer.files) {
                const newFiles = Array.from(e.dataTransfer.files).filter(
                  file => file.type === 'application/pdf'
                );
                setResumes(prev => [...prev, ...newFiles]);
              }
            }}
          >
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleResumeChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
            <div className="float" style={{ marginBottom: '1.25rem' }}>
              <Users size={40} style={{ color: 'var(--accent-primary)', opacity: 0.8 }} />
            </div>
            <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Drop files here or click to upload
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Supports PDF format only
            </p>
          </div>

          {resumes.length > 0 && (
            <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {resumes.map((file, index) => (
                <div 
                  key={index} 
                  className="animate-fade-in"
                  style={{ 
                    padding: '0.6rem 1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    fontSize: '0.85rem',
                    background: 'white',
                    border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: '12px',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <FileText size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                  <X 
                    size={16} 
                    style={{ cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 0.2s' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    onClick={() => removeResume(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="animate-fade-in" style={{ 
            color: '#dc2626', 
            backgroundColor: 'rgba(239, 68, 68, 0.05)', 
            padding: '1.25rem', 
            borderRadius: '14px', 
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            border: '1px solid rgba(239, 68, 68, 0.1)'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <button 
          type="submit" 
          className="btn-lumina" 
          disabled={isLoading || !jdText.trim() || resumes.length === 0}
          style={{ width: '100%', justifyContent: 'center', height: '60px', fontSize: '1.1rem' }}
        >
          {isLoading ? (
            <>
              <div className="animate-spin" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></div>
              Processing...
            </>
          ) : (
            <>
              Start AI Evaluation
              <Sparkles size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadSection;
