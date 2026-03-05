import React, { useEffect, useRef } from 'react';
import { Terminal, CheckCircle, AlertOctagon, Cpu } from 'lucide-react';

interface Log {
  id: string;
  type: 'log' | 'result' | 'error';
  message: string;
  filename?: string;
  timestamp: string;
}

interface ProcessMonitorProps {
  logs: Log[];
}

const ProcessMonitor: React.FC<ProcessMonitorProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', marginTop: '2rem', border: '1px solid rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Terminal size={18} style={{ color: 'var(--accent-primary)' }} />
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Backend Process Monitor
        </h3>
      </div>
      
      <div 
        ref={scrollRef}
        className="input-lumina" 
        style={{ 
          height: '250px', 
          overflowY: 'auto', 
          background: 'rgba(0,0,0,0.03)', 
          padding: '1rem',
          fontFamily: "'Fira Code', 'Courier New', monospace",
          fontSize: '0.8rem',
          lineHeight: 1.6,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}
      >
        {logs.map((log) => (
          <div key={log.id} style={{ display: 'flex', gap: '1rem', animation: 'fadeSlideIn 0.3s ease-out' }}>
            <span style={{ color: 'var(--text-secondary)', opacity: 0.5, whiteSpace: 'nowrap' }}>
              [{log.timestamp}]
            </span>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              {log.type === 'log' && <Cpu size={14} style={{ marginTop: '0.1rem', color: 'var(--accent-primary)' }} />}
              {log.type === 'result' && <CheckCircle size={14} style={{ marginTop: '0.1rem', color: '#10b981' }} />}
              {log.type === 'error' && <AlertOctagon size={14} style={{ marginTop: '0.1rem', color: '#ef4444' }} />}
              
              <span style={{ 
                color: log.type === 'error' ? '#ef4444' : log.type === 'result' ? '#10b981' : 'var(--text-primary)',
                fontWeight: log.type !== 'log' ? 700 : 400
              }}>
                {log.filename && <span style={{ opacity: 0.6, fontWeight: 700 }}>[{log.filename}] </span>}
                {log.message}
              </span>
            </div>
          </div>
        ))}
        {logs.length > 0 && (
          <div className="pulse" style={{ width: '8px', height: '14px', backgroundColor: 'var(--accent-primary)', opacity: 0.3, marginTop: '0.5rem' }}></div>
        )}
      </div>
    </div>
  );
};

export default ProcessMonitor;
