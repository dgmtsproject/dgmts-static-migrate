import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './NewsPage.css';
import drillRigNewsImg from '../../assets/drill-rig-news.jpeg';
import exhibitionNewsImg from '../../assets/exhibition_news.jpeg';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('news')
          .select('*')
          .order('news_date', { ascending: false })
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setNews(data || []);
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Unable to load news at the moment. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getImageForNews = (item, index) => {
    // Allow DB to store simple keys (or asset-like strings) and map them to real imports
    const imageKey = (item.picture || '').trim();

    if (imageKey) {
      // Map known keys / routes to imported assets
      if (
        imageKey === 'drill-rig-news' ||
        imageKey === 'src/assets/drill-rig-news.jpeg'
      ) {
        return drillRigNewsImg;
      }
      if (
        imageKey === 'exhibition_news' ||
        imageKey === 'src/assets/exhibition_news.jpeg'
      ) {
        return exhibitionNewsImg;
      }

      // Otherwise assume it's a full URL or public path
      return imageKey;
    }

    // Fallback to local themed images when picture is null/empty
    return index % 2 === 0 ? drillRigNewsImg : exhibitionNewsImg;
  };

  const getExcerpt = (content) => {
    if (!content) return '';
    const plain = content.replace(/<[^>]+>/g, '');
    return plain.length > 220 ? `${plain.slice(0, 220)}…` : plain;
  };

  return (
    <div className="news-page">
      <section className="news-hero">
        <div className="container">
          <p className="eyebrow">Company News</p>
          <h1>Latest News &amp; Updates</h1>
          <p className="subtitle">
            Stay up to date with DGMTS announcements, project highlights, and exhibition participation.
          </p>
        </div>
      </section>

      <section className="news-list-section">
        <div className="container">
          {loading && (
            <div className="news-state">
              <div className="spinner" />
              <p>Loading news…</p>
            </div>
          )}

          {!loading && error && (
            <div className="news-state error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && news.length === 0 && (
            <div className="news-state empty">
              <p>No news has been published yet. Please check back soon.</p>
            </div>
          )}

          {!loading && !error && news.length > 0 && (
            <div className="news-grid">
              {news.map((item, index) => (
                <article key={item.id} className="news-item-card">
                  <Link
                    to={`/news/${item.news_route || item.id}`}
                    className="news-item-link"
                  >
                    <div className="news-item-image">
                      <img
                        src={getImageForNews(item, index)}
                        alt={item.news_title || 'News image'}
                        loading="lazy"
                      />
                      {item.news_date && (
                        <div className="news-item-badge">
                          {new Date(item.news_date).getFullYear()}
                        </div>
                      )}
                    </div>
                    <div className="news-item-content">
                      {item.news_date && (
                        <time className="news-item-date">
                          {formatDate(item.news_date)}
                        </time>
                      )}
                      <h2 className="news-item-title">
                        {item.news_title || 'Untitled news item'}
                      </h2>
                      {item.news_content && (
                        <p className="news-item-excerpt">
                          {getExcerpt(item.news_content)}
                        </p>
                      )}
                      <div className="read-more-link">
                        Read More
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;

