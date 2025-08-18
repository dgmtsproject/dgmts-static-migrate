import React from 'react';
import './PublishedPapersPage.css';
import { publications, presentations, bookChapters } from './publishedPapersData';

const PublishedPapersPage = () => {
  return (
    <div className="papers-page">
      <div className="papers-container">
        <div className="papers-header">
          <h1 className="papers-title">Published Papers</h1>
          <p className="papers-intro">
            Dr. Hamid is also actively involved in practical oriented research and following is a list of his selected publications and presentation:
          </p>
        </div>

        <div className="papers-section">
          <h2 className="papers-section-title">Publications</h2>
          <div className="papers-list">
            {publications.map((paper, index) => (
              <div key={index} className="paper-card">
                <h3 className="paper-title">{paper.title}</h3>
                <p className="paper-authors">{paper.authors}</p>
                <p className="paper-details">{paper.details}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="papers-section">
          <h2 className="papers-section-title">Technical Presentation</h2>
          <div className="papers-list">
            {presentations.map((paper, index) => (
              <div key={index} className="paper-card">
                <h3 className="paper-title">{paper.title}</h3>
                <p className="paper-details">{paper.details}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="papers-section">
          <h2 className="papers-section-title">Books’ Chapters</h2>
          <div className="papers-list">
            {bookChapters.map((paper, index) => (
              <div key={index} className="paper-card">
                <h3 className="paper-title">{paper.title}</h3>
                {paper.authors && <p className="paper-authors">{paper.authors}</p>}
                <p className="paper-details">{paper.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishedPapersPage;