import React from 'react';
import './NewsSection.css';

const NewsSection = () => {
  const news = [
    {
      title: 'DGMTS Completes Major Infrastructure Project in Northern Virginia',
      content: 'Our team successfully completed comprehensive geotechnical analysis for a major transportation infrastructure project, ensuring safety and compliance with all regulatory standards...',
      image: 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      date: '2024-01-15',
      category: 'Projects'
    },
    {
      title: 'New Laboratory Accreditation Expands Testing Capabilities',
      content: 'DGMTS has received additional laboratory accreditations, expanding our materials testing capabilities to better serve our clients across the Mid-Atlantic region...',
      image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      date: '2024-01-10',
      category: 'News'
    },
    {
      title: 'DGMTS Team Presents at National Geotechnical Conference',
      content: 'Our senior engineers presented groundbreaking research on innovative soil stabilization techniques at this years National Geotechnical Engineering Conference...',
      image: 'https://images.pexels.com/photos/3862379/pexels-photo-3862379.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      date: '2024-01-05',
      category: 'Research'
    }
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section className="news-section home-section bg-grey-50">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Latest News & Updates</h2>
          <p className="section-subtitle">
            Stay informed about our latest projects, achievements, and industry insights
          </p>
        </div>

        <div className="news-grid">
          {news.map((article, index) => (
            <article key={index} className="news-card">
              <div className="news-image">
                <img src={article.image} alt={article.title} />
                <div className="news-category">{article.category}</div>
              </div>
              <div className="news-content">
                <div className="news-meta">
                  <time className="news-date">{formatDate(article.date)}</time>
                </div>
                <h3 className="news-title">
                  <a href={`/news/${article.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    {article.title}
                  </a>
                </h3>
                <p className="news-excerpt">{article.content}</p>
                <div className="news-footer">
                  <a 
                    href={`/news/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="news-link"
                  >
                    Read More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="news-cta">
          <a href="/news" className="btn btn-primary">
            View All News
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;