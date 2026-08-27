import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Sparkles,
  Activity,
  CreditCard,
  ArrowRight,
  ExternalLink,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import './EngineeringToolsPage.css';

/*
 * DGMTS Engineering Tools directory.
 *
 * Each entry is a tool/platform built by DGMTS. To add or update a tool, edit
 * this array — the page renders entirely from it.
 *
 *   url      : where the tool lives. An external "http(s)://" link opens in a new
 *              tab; a site-internal path (e.g. "/payment") uses in-app routing.
 *              Leave as "" (empty) for tools that aren't publicly reachable yet —
 *              the card then shows a "Request Access" button pointing to /contact.
 *   access   : 'public' | 'internal'  — drives the badge + button wording.
 *   status   : short label shown on the badge ("Live", "Beta", "Internal", …).
 *   category : used by the filter bar; keep in sync with the CATEGORIES list below.
 */
const tools = [
  {
    id: 'projects-system',
    name: 'DGMTS Projects System',
    tagline: 'Searchable archive of every DGMTS project',
    description:
      'A central, searchable record of the firm’s project archive — browse, filter and search 500+ jobs and open a full detail view for scope of work, DGMTS team, client contacts, vendors, fees, key dates and source documents.',
    category: 'Project Management',
    status: 'Internal',
    access: 'internal',
    url: '',
    icon: FolderKanban,
    accent: '#4a90e2',
    features: [
      '500+ historical projects, deduplicated across years',
      'Filter by service type, location and year',
      'Verified vs. folder-only record badging',
      'Per-project team, contacts, vendors & attachments',
    ],
  },
  {
    id: 'proposal-assistant',
    name: 'DGMTS Proposal Assistant',
    tagline: 'AI-assisted RFP / RFQ proposal drafting',
    description:
      'Reads an incoming solicitation, retrieves the best-matching past projects and key personnel from the firm’s archive, and drafts each proposal section under the solicitation’s own headings — ready for review and one-click Word export.',
    category: 'AI & Automation',
    status: 'Beta',
    access: 'internal',
    url: '',
    icon: Sparkles,
    accent: '#7c3aed',
    features: [
      'Parses RFQ scope and verbatim section headings',
      'Matches won projects & SF 330 resumes',
      'Section-by-section AI drafts for human review',
      'Exports a formatted .docx proposal',
    ],
  },
  {
    id: 'instrumentation-monitoring',
    name: 'Instrumentation Monitoring Platform',
    tagline: 'Live structural & geotechnical monitoring',
    description:
      'The firm’s instrumentation & monitoring portal for tracking field sensor data — vibration, tilt, settlement and condition surveys — with dashboards and alerting for construction and infrastructure sites.',
    category: 'Monitoring',
    status: 'Internal',
    access: 'internal',
    url: '',
    icon: Activity,
    accent: '#00a86b',
    features: [
      'Real-time sensor dashboards',
      'Vibration, tilt & settlement monitoring',
      'Threshold-based alerting',
      'Project-based access for clients & staff',
    ],
  },
  {
    id: 'payment-portal',
    name: 'Client Payment Portal',
    tagline: 'Secure online invoice payments',
    description:
      'Lets DGMTS clients review and pay invoices online through a secure portal, with approval workflows and account access for authorized users.',
    category: 'Client Services',
    status: 'Live',
    access: 'public',
    url: '/payment',
    icon: CreditCard,
    accent: '#ff6b35',
    features: [
      'Secure online invoice payments',
      'Client account access & approvals',
      'Payment history and receipts',
    ],
  },
];

const CATEGORIES = [
  'All',
  'Project Management',
  'AI & Automation',
  'Monitoring',
  'Client Services',
];

const isExternal = (url) => /^https?:\/\//i.test(url || '');

// Plain render helper (not a props component) so we render each tool card
// inline without tripping react/prop-types on a one-off internal shape.
const renderToolCard = (tool) => {
  const Icon = tool.icon;
  const hasLink = Boolean(tool.url);
  const external = isExternal(tool.url);

  // Public tool with a real link → open it. Otherwise route to /contact so the
  // card always has a working call-to-action (no dead "#" links).
  const ctaLabel = hasLink ? 'Open Tool' : 'Request Access';
  const CtaIcon = hasLink ? (external ? ExternalLink : ArrowRight) : Lock;

  const cardStyle = { '--tool-accent': tool.accent };

  const inner = (
    <>
      <div className="tool-card__top">
        <div className="tool-card__icon">
          <Icon strokeWidth={1.75} />
        </div>
        <span className={`tool-card__status tool-card__status--${tool.access}`}>
          {tool.status}
        </span>
      </div>

      <h3 className="tool-card__name">{tool.name}</h3>
      <p className="tool-card__tagline">{tool.tagline}</p>
      <p className="tool-card__desc">{tool.description}</p>

      {tool.features?.length > 0 && (
        <ul className="tool-card__features">
          {tool.features.map((f, i) => (
            <li key={i}>
              <CheckCircle2 className="tool-card__check" strokeWidth={2} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      <span className="tool-card__cta">
        {ctaLabel}
        <CtaIcon className="tool-card__cta-icon" strokeWidth={2} />
      </span>
    </>
  );

  const cat = <span className="tool-card__category">{tool.category}</span>;

  // External URL → plain anchor (new tab). Internal path → router Link.
  // No URL → route to the contact page to request access.
  if (hasLink && external) {
    return (
      <a
        key={tool.id}
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="tool-card"
        style={cardStyle}
      >
        {cat}
        {inner}
      </a>
    );
  }

  return (
    <Link
      key={tool.id}
      to={hasLink ? tool.url : '/contact'}
      className="tool-card"
      style={cardStyle}
    >
      {cat}
      {inner}
    </Link>
  );
};

const EngineeringToolsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = useMemo(() => {
    if (activeCategory === 'All') return tools;
    return tools.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="eng-tools-page">
      {/* Hero */}
      <section className="eng-tools-hero">
        <div className="container">
          <div className="eng-tools-hero__content">
            <span className="eng-tools-hero__eyebrow">Built by DGMTS</span>
            <h1>Engineering Tools</h1>
            <p>
              Explore the digital tools and platforms our team has built to power
              geotechnical engineering, project delivery and client services —
              from our project archive to AI-assisted proposals and live field
              monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="eng-tools-filters">
        <div className="container">
          <div className="eng-tools-filters__bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`eng-tools-filter ${activeCategory === cat ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="eng-tools-grid-section">
        <div className="container">
          <div className="eng-tools-stats">
            <p>
              Showing {filteredTools.length} of {tools.length} tools
            </p>
          </div>

          <div className="eng-tools-grid">
            {filteredTools.map((tool) => renderToolCard(tool))}
          </div>

          {filteredTools.length === 0 && (
            <div className="eng-tools-empty">
              <h3>No tools in this category yet</h3>
              <p>Check back soon — we’re always building.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="eng-tools-cta">
        <div className="container">
          <div className="eng-tools-cta__content">
            <h2>Need a custom engineering tool?</h2>
            <p>
              Our IT &amp; digital solutions team builds bespoke software for
              geotechnical and construction workflows. Tell us what you need.
            </p>
            <div className="eng-tools-cta__actions">
              <Link to="/contact" className="btn btn-primary">
                Get in Touch
              </Link>
              <Link to="/it-services" className="btn btn-secondary">
                IT &amp; Digital Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EngineeringToolsPage;
