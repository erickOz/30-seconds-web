import Head from 'next/head';
import settings from 'settings/global';
import literals from 'lang/en/client/common';
import { useShellState } from 'state/shell';

/**
 * Creates the `<head>` metadata content.
 * Dependent on the `next/head` component.
 * @param {string} title - Page title (leave empty to use the website title)
 * @param {string} description - Page description (leave empty to use the website title)
 * @param {string} logoSrc - Page logo URI
 * @param {object} structuredData - Structured data for the page (if any)
 * @param {object} breadcrumbsData - Structured data for breadcrumbs (if any)
 * @param {string} canonical - Canonical slug (not full URL) of this page, if canonical
 */
const Meta = ({
  title,
  description = '',
  logoSrc = '/assets/logo.png',
  pageType = 'website',
  structuredData,
  breadcrumbsData,
  canonical = '',
}) => {
  const { acceptsCookies } = useShellState();
  const metaDescription = description || literals.siteDescription;
  const titleString = title
    ? `${title} - ${literals.siteName}`
    : literals.siteName;

  // Load scripts
  const scripts = [];

  // Adsense
  if (process.env.NODE_ENV !== 'development') {
    scripts.push({
      key: 'adsense',
      async: true,
      src:
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9823478685429367',
      crossOrigin: 'anonymous',
    });
  }

  if (structuredData) {
    scripts.push({
      type: 'application/ld+json',
      key: 'structured-data',
      innerHTML: JSON.stringify(structuredData),
    });
  }

  if (breadcrumbsData) {
    scripts.push({
      type: 'application/ld+json',
      key: 'breadcrumb-data',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbsData.map((breadcrumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@id': `${settings.websiteUrl}${breadcrumb.url}`,
            name: `${breadcrumb.name}`,
          },
        })),
      }),
    });
  }

  if (typeof window !== 'undefined') {
    scripts.push({
      async: true,
      key: 'gtag-id',
      src: `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalytics.id}`,
    });
    // GTAG
    scripts.push({
      key: 'gtag',
      innerHTML: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag(
        'consent',
        'default',
        ${JSON.stringify(settings.googleAnalytics.consent)}
      );
      gtag(
        'config',
        '${settings.googleAnalytics.id}',
        ${JSON.stringify(settings.googleAnalytics.config)}
      );
      `,
    });
    // Send a pageview only the first time that gtag is added (is this safe?)
    if (typeof gtag === 'undefined') {
      scripts.push({
        key: 'gtag-pageview',
        innerHTML: `
        var hasFired = false;
        if(!hasFired){
          window.gtag('event', 'page_view', { page_path: '${window.location.pathname}' });
          hasFired = true;
        }`,
      });
    }
  }

  if (acceptsCookies) {
    scripts.push({
      key: 'gtag-consent',
      innerHTML: `
      gtag(
        'consent',
        'update',
        ${JSON.stringify(settings.googleAnalytics.consentGranted)}
      );
    `,
    });
  }

  return (
    <Head>
      <title>{titleString}</title>
      <meta name='description' content={metaDescription} />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta property='og:title' content={titleString} />
      <meta property='og:description' content={metaDescription} />
      <meta property='og:type' content={pageType} />
      <meta property='og:image' content={`${settings.websiteUrl}${logoSrc}`} />
      <meta name='twitter:card' content='summary_large_image' />
      {scripts.map(({ key, innerHTML, ...rest }) => (
        <script
          key={key}
          dangerouslySetInnerHTML={{ __html: innerHTML }}
          {...rest}
        />
      ))}
      <link
        rel='preconnect dns-prefetch'
        key='preconnect-google-analytics'
        href='https://www.google-analytics.com'
      />
      <link
        key='link-sitemap'
        rel='sitemap'
        href='/sitemap.xml'
        type='application/xml'
      />
      <link
        key='link-rss-feed'
        rel='alternate'
        href='/feed'
        type='application/rss+xml'
        title='30secondsofcode.org'
      />
      <link
        rel='preload'
        type='font/woff2'
        href='/assets/Inter.var.woff2'
        as='font'
        crossOrigin='anonymous'
      />
      <link
        rel='preload'
        type='font/woff2'
        href='/assets/Raleway-Medium.woff2'
        as='font'
        crossOrigin='anonymous'
      />
      <link
        rel='preload'
        type='font/woff2'
        href='/assets/RobotoMono-Regular.woff2'
        as='font'
        crossOrigin='anonymous'
      />
      <link
        rel='preload'
        type='font/woff2'
        href='/assets/icons.woff2'
        as='font'
        crossOrigin='anonymous'
      />
      <link
        rel='icon'
        href={`/assets/icons/favicon-32x32.png?v=${settings.manifestCacheKey}`}
        type='image/png'
      />
      <link
        rel='manifest'
        href='/manifest.webmanifest'
        crossOrigin='anonymous'
      />
      <meta name='theme-color' content='#1e253d' />,
      <link
        rel='icon'
        sizes='192x192'
        href={`/assets/icons/icon-192x192.png?v=${settings.manifestCacheKey}`}
      />
      <link
        rel='apple-touch-icon'
        href={`/assets/icons/icon-180x180.png?v=${settings.manifestCacheKey}`}
      />
      {canonical ? (
        <link rel='canonical' href={`${settings.websiteUrl}${canonical}`} />
      ) : null}
    </Head>
  );
};

export default Meta;
