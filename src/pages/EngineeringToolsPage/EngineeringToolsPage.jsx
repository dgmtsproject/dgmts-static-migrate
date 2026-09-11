import { Link } from 'react-router-dom';
import {
  Anchor,
  BrickWall,
  SquareStack,
  ArrowRight,
  ExternalLink,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import zhenranShi from '../../assets/zhenran-shi.jpeg';
import './EngineeringToolsPage.css';

/*
 * DGMTS Engineering Tools directory.
 *
 * Each entry is a tool/platform built by DGMTS. To add or update a tool, edit
 * this array — the page renders entirely from it.
 *
 *   url      : where the tool lives. An external "http(s)://" link opens in a new
 *              tab; a site-internal SPA path (e.g. "/payment") uses in-app routing.
 *              Leave as "" (empty) for tools that aren't publicly reachable yet —
 *              the card then shows a "Request Access" button pointing to /contact.
 *   newTab   : set true for a static file served from /public (e.g. the standalone
 *              calculators in /tools/*.html). These must open via a real browser
 *              navigation in a new tab, NOT the SPA router (which would 404 them).
 *   access   : 'public' | 'internal'  — drives the badge + button wording.
 *   status   : short label shown on the badge ("Live", "Beta", "Internal", …).
 *   category : grouping label; 'Engineering Calculators' also shows the
 *              "Developed by" engineer credit on the card.
 */
const tools = [
  {
    id: 'micropile-design-lrfd',
    name: 'Micropile Design (LRFD)',
    tagline: 'Micropile capacity calculator',
    description:
      'Mr. Zhenran Shi, PE has developed a Micropile Design – LRFD Tool in HTML format to provide engineers and design professionals with a convenient resource for preliminary micropile design and evaluation. This web-based tool assists with key micropile design calculations using the Load and Resistance Factor Design (LRFD) methodology. It provides an organized interface for entering design parameters, performing calculations, and reviewing the resulting design information. By incorporating the calculation process into an accessible web-based format, the tool provides a convenient alternative to traditional standalone calculation worksheets and can support engineers during preliminary design, evaluation, and review.',
    category: 'Engineering Calculators',
    status: 'Live',
    access: 'public',
    url: '/tools/micropile-design-lrfd.html',
    newTab: true,
    icon: Anchor,
    accent: '#3498db',
    features: [
      'Factored geotechnical & structural resistance',
      'Strength and extreme limit states',
      'Live cross-section and soil-profile drawings',
      'Step-by-step equations shown as you type',
    ],
  },
  {
    id: 'gravity-retaining-wall',
    name: 'Gravity Retaining Wall',
    tagline: 'Wall stability computations',
    description:
      'Mr. Zhenran Shi, PE has developed a Gravity Retaining Wall Computation Tool in HTML format to support engineers and design professionals in the preliminary evaluation of gravity retaining wall systems. The tool provides a streamlined approach for evaluating key gravity retaining wall design parameters and performing associated engineering calculations. Its structured interface allows users to enter project-specific inputs and efficiently review calculation results in a clear and organized format. The web-based platform provides a convenient digital resource for preliminary retaining wall evaluation and design development while reducing reliance on conventional calculation spreadsheets.',
    category: 'Engineering Calculators',
    status: 'Live',
    access: 'public',
    url: '/tools/gravity-retaining-wall.html',
    newTab: true,
    icon: BrickWall,
    accent: '#2980b9',
    features: [
      'Overturning, sliding & bearing safety factors',
      'Active / passive earth pressure coefficients',
      'Scaled wall cross-section drawing',
      'Full stability table with pass / fail status',
    ],
  },
  {
    id: 'spread-footing-bearing',
    name: 'Spread Footing Bearing (LRFD)',
    tagline: 'Bearing resistance for spread footings',
    description:
      'To support foundation design applications, Mr. Zhenran Shi, PE has developed a BC Equation for Spread Footings – LRFD Tool in HTML format. This web-based engineering tool assists with the evaluation of spread footing bearing capacity using the BC Equation and the LRFD design approach. Users can enter relevant foundation and soil parameters and review the resulting calculations and design parameters through a structured and easy-to-use interface. By incorporating the calculation procedures into a web-based platform, the tool provides engineers and design professionals with a convenient resource for preliminary foundation design, evaluation, and engineering review.',
    category: 'Engineering Calculators',
    status: 'Live',
    access: 'public',
    url: '/tools/lrfd-spread-footing-bearing.html',
    newTab: true,
    icon: SquareStack,
    accent: '#16a085',
    features: [
      'Strength, extreme & service limit states',
      'Resistance-vs-width design chart',
      'Bearing capacity, shape, depth & groundwater factors',
      'Step-by-step math for your sample width',
    ],
  },
];

const isExternal = (url) => /^https?:\/\//i.test(url || '');

// Plain render helper (not a props component) so we render each tool card
// inline without tripping react/prop-types on a one-off internal shape.
const renderToolCard = (tool) => {
  const Icon = tool.icon;
  const hasLink = Boolean(tool.url);
  const external = isExternal(tool.url);
  // Open in a new tab for external URLs and for static /public files (newTab):
  // both need a real browser navigation via a plain <a>, not the SPA router.
  const opensNewTab = hasLink && (external || tool.newTab);

  // Public tool with a real link → open it. Otherwise route to /contact so the
  // card always has a working call-to-action (no dead "#" links).
  const ctaLabel = hasLink ? 'Open Tool' : 'Request Access';
  const CtaIcon = hasLink ? (opensNewTab ? ExternalLink : ArrowRight) : Lock;

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

      {tool.category === 'Engineering Calculators' && (
        <figure className="tool-card__author">
          <img
            src={zhenranShi}
            alt="Mr. Zhenran Shi, P.E."
            className="tool-card__author-photo"
            loading="lazy"
          />
          <figcaption className="tool-card__author-caption">
            Developed by Mr. Zhenran Shi, P.E.
          </figcaption>
        </figure>
      )}

      <span className="tool-card__cta">
        {ctaLabel}
        <CtaIcon className="tool-card__cta-icon" strokeWidth={2} />
      </span>
    </>
  );

  const cat = <span className="tool-card__category">{tool.category}</span>;

  // External URL or static /public file → plain anchor (new tab). Internal SPA
  // path → router Link. No URL → route to the contact page to request access.
  if (opensNewTab) {
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
  return (
    <div className="eng-tools-page">
      {/* Hero */}
      <section className="eng-tools-hero">
        <div className="container">
          <div className="eng-tools-hero__content">
            <h1>Engineering Tools</h1>
            <p>
              As part of our ongoing commitment to developing practical
              engineering resources and improving access to design tools, DGMTS
              develops Engineering Tools that combine engineering expertise with
              practical digital solutions. These resources are intended to assist
              clients, engineers, and project teams by streamlining engineering
              calculations, improving efficiency, and providing convenient tools
              for preliminary design and evaluation.
            </p>
            <p>
              We welcome you to explore these tools and share your feedback as we
              continue to expand our collection of engineering resources.
            </p>
            <p className="eng-tools-hero__disclaimer">
              <strong>Disclaimer:</strong> These tools are provided for
              informational and preliminary design purposes only. DGMTS makes no
              representations or warranties regarding the accuracy, completeness,
              or reliability of the calculations or results. Users are solely
              responsible for independently verifying all inputs, assumptions,
              methodologies, and results and for obtaining appropriate
              professional engineering review and approval before using or
              relying upon the tools or their outputs for any project or design
              decision.
            </p>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="eng-tools-grid-section">
        <div className="container">
          <div className="eng-tools-stats">
            <p>
              Showing {tools.length} of {tools.length} tools
            </p>
          </div>

          <div className="eng-tools-grid">
            {tools.map((tool) => renderToolCard(tool))}
          </div>
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
