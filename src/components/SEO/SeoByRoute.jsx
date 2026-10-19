import { useLocation } from 'react-router-dom';
import { resolveSeoForPath } from '../../constants/seo';
import SEO from './SEO';

/**
 * Applies per-route SEO from the central seo.js map.
 */
const SeoByRoute = () => {
  const { pathname } = useLocation();
  const seo = resolveSeoForPath(pathname);

  return (
    <SEO
      title={seo.title}
      description={seo.description}
      path={seo.path}
      noIndex={seo.noIndex}
      ogImage={seo.ogImage}
    />
  );
};

export default SeoByRoute;
