import { useState, useEffect } from 'react';
import { RefreshCw, Quote } from 'lucide-react';

const QuoteBox = () => {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      const data = await response.json();
      
      if (data && data.length > 0) {
        setQuote({
          text: data[0].q,
          author: data[0].a
        });
        
        // Save to localStorage with today's date
        const today = new Date().toDateString();
        localStorage.setItem('dailyQuote', JSON.stringify({
          quote: data[0].q,
          author: data[0].a,
          date: today
        }));
      } else {
        throw new Error('No quote received');
      }
    } catch (err) {
      setError('Failed to fetch quote');
      console.error('Error fetching quote:', err);
      
      // Fallback to a default quote
      setQuote({
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSavedQuote = () => {
    const saved = localStorage.getItem('dailyQuote');
    if (saved) {
      try {
        const { quote: savedQuote, author: savedAuthor, date } = JSON.parse(saved);
        const today = new Date().toDateString();
        
        if (date === today) {
          setQuote({ text: savedQuote, author: savedAuthor });
          return true;
        }
      } catch (err) {
        console.error('Error loading saved quote:', err);
      }
    }
    return false;
  };

  useEffect(() => {
    // Try to load saved quote for today first
    if (!loadSavedQuote()) {
      // If no saved quote for today, fetch a new one
      fetchQuote();
    }
  }, []);

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Quote className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Daily Motivation</h3>
        </div>
        <button
          onClick={fetchQuote}
          disabled={loading}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-200 mb-2">{error}</p>
          <button
            onClick={fetchQuote}
            className="text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div>
          <blockquote className="text-lg leading-relaxed mb-4">
            "{quote.text}"
          </blockquote>
          <cite className="text-sm opacity-90">
            — {quote.author}
          </cite>
        </div>
      )}

      <div className="mt-4 text-xs opacity-75">
        Quote updates daily
      </div>
    </div>
  );
};

export default QuoteBox;
