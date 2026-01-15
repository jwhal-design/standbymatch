import React, { useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'standby-match-data';

function App() {
  const [matches, setMatches] = useState([]);
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(getEmptyForm());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMatches(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load matches:', e);
    }
  }, []);

  // Save to localStorage whenever matches change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
    } catch (e) {
      console.error('Failed to save matches:', e);
    }
  }, [matches]);

  function getEmptyForm() {
    return {
      dateWatched: new Date().toISOString().split('T')[0],
      matchDate: '',
      competitors: '',
      promotion: '',
      matchType: '',
      rating: 3,
      blood: false,
      comment: ''
    };
  }

  function resetForm() {
    setForm(getEmptyForm());
    setEditingId(null);
  }

  function handleSubmit() {
    if (!form.competitors.trim()) return;
    
    if (editingId) {
      setMatches(matches.map(m => 
        m.id === editingId ? { ...form, id: editingId } : m
      ));
    } else {
      const newMatch = { ...form, id: Date.now().toString() };
      setMatches([newMatch, ...matches]);
    }
    
    resetForm();
    setView('list');
  }

  function handleEdit(match) {
    setForm(match);
    setEditingId(match.id);
    setView('add');
  }

  function handleDelete(id) {
    if (window.confirm('Delete this match?')) {
      setMatches(matches.filter(m => m.id !== id));
    }
  }

  function exportCSV() {
    if (matches.length === 0) return;
    
    const headers = ['Date Watched', 'Match Date', 'Competitors', 'Promotion', 'Match Type', 'Rating', 'Blood', 'Comment'];
    const rows = matches.map(m => [
      m.dateWatched || '',
      m.matchDate || '',
      `"${(m.competitors || '').replace(/"/g, '""')}"`,
      `"${(m.promotion || '').replace(/"/g, '""')}"`,
      `"${(m.matchType || '').replace(/"/g, '""')}"`,
      m.rating,
      m.blood ? 'Yes' : 'No',
      `"${(m.comment || '').replace(/"/g, '""')}"`
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `standby-match-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function setRating(value) {
    setForm({ ...form, rating: value });
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-wrapper">
          <div className="action-strip">
            <span className="action-text">ACTION</span>
          </div>
          <div className="header-main">
            <div className="red-banner">
              <span className="distributor-text">THE KING OF SPORTS</span>
            </div>
            <div className="green-field">
              <div className="title-stack">
                <div className="standby-text">STANDBY</div>
                <div className="match-text">MATCH</div>
              </div>
            </div>
            <div className="cream-band">
              <span className="subtitle-text">Personal Tape Library</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - Bottom on mobile for thumb access */}
      <nav className="nav">
        <button 
          className={`nav-btn ${view === 'list' ? 'active' : ''}`}
          onClick={() => { resetForm(); setView('list'); }}
        >
          LOG
        </button>
        <button 
          className={`nav-btn ${view === 'add' ? 'active' : ''}`}
          onClick={() => { resetForm(); setView('add'); }}
        >
          {editingId ? 'EDIT' : 'ADD'}
        </button>
        <button 
          className="nav-btn"
          onClick={exportCSV}
          disabled={matches.length === 0}
        >
          CSV
        </button>
      </nav>

      {/* Main Content */}
      <main className="main">
        {view === 'list' && (
          <div className="match-list">
            {matches.length === 0 ? (
              <div className="empty-state">
                <p className="empty-text">NO MATCHES</p>
                <p className="empty-subtext">Tap ADD to log your first match</p>
              </div>
            ) : (
              matches.map(match => (
                <div key={match.id} className="match-card">
                  <div className="match-top">
                    <div className="match-tags">
                      <span className="tag-promotion">{match.promotion || '???'}</span>
                      {match.matchType && <span className="tag-type">{match.matchType}</span>}
                      {match.blood && <span className="tag-blood">BLOOD</span>}
                    </div>
                    <div className="match-rating">
                      <Stars rating={match.rating} />
                    </div>
                  </div>
                  
                  <h3 className="match-competitors">{match.competitors}</h3>
                  
                  <div className="match-dates">
                    <span>{match.matchDate || 'Date unknown'}</span>
                    <span className="date-separator">•</span>
                    <span>Watched {match.dateWatched}</span>
                  </div>
                  
                  {match.comment && (
                    <p className="match-comment">"{match.comment}"</p>
                  )}
                  
                  <div className="match-actions">
                    <button className="btn-edit" onClick={() => handleEdit(match)}>EDIT</button>
                    <button className="btn-delete" onClick={() => handleDelete(match.id)}>DELETE</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === 'add' && (
          <div className="form">
            <div className="form-group">
              <label>COMPETITORS</label>
              <input
                type="text"
                value={form.competitors}
                onChange={(e) => setForm({...form, competitors: e.target.value})}
                placeholder="Flair vs. Steamboat"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>PROMOTION</label>
                <input
                  type="text"
                  value={form.promotion}
                  onChange={(e) => setForm({...form, promotion: e.target.value})}
                  placeholder="NWA, AJPW..."
                />
              </div>
              <div className="form-group">
                <label>MATCH TYPE</label>
                <input
                  type="text"
                  value={form.matchType}
                  onChange={(e) => setForm({...form, matchType: e.target.value})}
                  placeholder="Title, Cage..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>MATCH DATE</label>
                <input
                  type="date"
                  value={form.matchDate}
                  onChange={(e) => setForm({...form, matchDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>WATCHED</label>
                <input
                  type="date"
                  value={form.dateWatched}
                  onChange={(e) => setForm({...form, dateWatched: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>RATING</label>
              <RatingPicker rating={form.rating} onChange={setRating} />
            </div>

            <div className="form-group">
              <label 
                className="blood-toggle"
                onClick={() => setForm({...form, blood: !form.blood})}
              >
                <span className={`blood-indicator ${form.blood ? 'active' : ''}`}>
                  {form.blood ? '●' : '○'}
                </span>
                <span className="blood-label">BLOOD</span>
              </label>
            </div>

            <div className="form-group">
              <label>COMMENTS</label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm({...form, comment: e.target.value})}
                placeholder="Quick thoughts..."
                rows={2}
              />
            </div>

            <div className="form-actions">
              <button className="btn-submit" onClick={handleSubmit}>
                {editingId ? 'UPDATE' : 'LOG MATCH'}
              </button>
              {editingId && (
                <button className="btn-cancel" onClick={() => { resetForm(); setView('list'); }}>
                  CANCEL
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
      </footer>
    </div>
  );
}

// Star display component
function Stars({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const isPlus = rating > 5;
  
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span 
          key={i} 
          className={`star ${i <= fullStars ? 'filled' : ''} ${i === fullStars + 1 && hasHalf ? 'half' : ''}`}
        >
          ★
        </span>
      ))}
      {isPlus && <span className="star-plus">+</span>}
    </span>
  );
}

// Rating picker component - thumb-friendly
function RatingPicker({ rating, onChange }) {
  const options = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5];
  
  return (
    <div className="rating-picker">
      {options.map(value => (
        <button
          key={value}
          type="button"
          className={`rating-option ${rating === value ? 'selected' : ''} ${value > 5 ? 'plus' : ''}`}
          onClick={() => onChange(value)}
        >
          {value > 5 ? '5+' : value}
        </button>
      ))}
    </div>
  );
}

export default App;
