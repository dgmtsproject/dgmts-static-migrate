import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './NewsDetailPage.css';
import drillRigNewsImg from '../../assets/drill-rig-news.jpeg';
import exhibitionNewsImg from '../../assets/exhibition_news.jpeg';

const NewsDetailPage = () => {
  const { slug } = useParams(); // slug = news_route
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('news')
          .select('*')
          .eq('news_route', slug)
          .single();

        if (fetchError) throw fetchError;
        setNewsItem(data);
      } catch (err) {
        console.error('Error loading news item:', err);
        setError('News article not found.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchNewsItem();
    }
  }, [slug]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Parse YYYY-MM-DD manually to avoid UTC shift
    const [year, month, day] = String(dateString).split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const resolveImage = (item) => {
    const imageKey = (item?.picture || '').trim();
    if (imageKey) {
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
      return imageKey;
    }
    return drillRigNewsImg;
  };

  return (
    <div className="news-detail-page">
      {loading && (
        <div className="news-detail-state">
          <div className="spinner" />
          <p>Loading article…</p>
        </div>
      )}

      {!loading && (error || !newsItem) && (
        <div className="container">
          <div className="news-detail-state error">
            <p>{error || 'News article not found.'}</p>
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate('/news')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" />
              </svg>
              Back to all news
            </button>
          </div>
        </div>
      )}

      {!loading && newsItem && (
        <>
          <section className="news-detail-hero">
            <div className="container">
              <nav className="breadcrumb">
                <Link to="/news">News</Link>
                <span className="separator">/</span>
                <span className="current">{newsItem.news_title}</span>
              </nav>
              {newsItem.news_date && (
                <time className="news-detail-date">
                  {formatDate(newsItem.news_date)}
                </time>
              )}
              <h1 className="news-detail-title">
                {newsItem.news_title || 'News article'}
              </h1>
            </div>
          </section>

          <section className="news-detail-media-section">
            <div className="container">
              <div className="news-detail-media">
                <img
                  src={resolveImage(newsItem)}
                  alt={newsItem.news_title || 'News image'}
                />
              </div>
            </div>
          </section>

          <section className="news-detail-body-section">
            <div className="container">
              <div className="news-detail-body">
                {newsItem.news_content ? (
                  <div
                    className="news-detail-text"
                    dangerouslySetInnerHTML={{ __html: newsItem.news_content }}
                  />
                ) : (
                  <p className="news-detail-text muted">
                    Details for this news item will be available soon.
                  </p>
                )}

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => navigate('/news')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" />
                  </svg>
                  Back to news feed
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default NewsDetailPage;

