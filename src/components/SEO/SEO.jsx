import { Helmet } from 'react-helmet-async';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '../../constants/seo';

/**
 * Sets document title, meta description, canonical, and social tags.
 */
const SEO = ({
  title,
  description,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}) => {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl =
    canonicalPath === '/'
      ? `${SITE_URL}/`
      : `${SITE_URL}${canonicalPath.replace(/\/+$/, '')}`;

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={canonicalUrl} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      {description ? (
        <meta property="og:description" content={description} />
      ) : null}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      {description ? (
        <meta name="twitter:description" content={description} />
      ) : null}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
