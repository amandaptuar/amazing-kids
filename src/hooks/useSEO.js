import { useEffect } from 'react';

const useSEO = ({ 
  title, 
  description, 
  keywords = "amazing kids of india, national ranking competition, NASPE india, youngest athlete, kids sports academy, fastest skater kid, youngest cyclist india, youth sports ranking, kids athletics competition, school sports events, best kids sports programs, early childhood physical education, kids running competition, sports for 3 to 10 year olds, junior olympics india, national academy for sports and physical education, kids talent hunt, sports scholarships for kids, amazing kids leaderboard, interactive sports games, school ranking india, student athlete registration, kids sports foundation, future olympian program, grassroots sports development, child athlete ranking, state level kids sports, district sports competition kids, national level medals kids, sports gear for kids, amazing kids official store, kids physical fitness, healthy kids india, youth empowerment through sports, child development physical activities, competitive sports for children, youngest high jumper, youngest thrower, kids marathon india, early sports training, preschool sports programs, primary school sports ranking, india sports youth talent, budding athletes india, top sports schools india, kids active lifestyle, amazing kids registration", 
  author = "Amazing Kids of India",
  url = "https://amazingkidsofindia.com",
  image = "https://amazingkidsofindia.com/favicon.png",
  type = "website"
}) => {
  useEffect(() => {
    const fullTitle = `${title} | Amazing Kids of India`;

    // 1. Update Title
    if (title) document.title = fullTitle;

    // Helper function to update or create tags
    const setMetaTag = (selector, attribute, value) => {
      if (!value) return;
      let el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', value);
      } else {
        el = document.createElement('meta');
        
        // Handle name vs property based on standard
        if (selector.includes('property=')) {
          const propName = selector.match(/property="([^"]+)"/)[1];
          el.setAttribute('property', propName);
        } else {
          const propName = selector.match(/name="([^"]+)"/)[1];
          el.setAttribute('name', propName);
        }
        
        el.setAttribute('content', value);
        document.head.appendChild(el);
      }
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'content', description);
    setMetaTag('meta[name="keywords"]', 'content', keywords);
    setMetaTag('meta[name="author"]', 'content', author);
    setMetaTag('meta[name="robots"]', 'content', 'index, follow');
    setMetaTag('meta[name="language"]', 'content', 'English');

    // 3. Open Graph (Facebook/LinkedIn)
    setMetaTag('meta[property="og:title"]', 'content', fullTitle);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:type"]', 'content', type);
    setMetaTag('meta[property="og:url"]', 'content', url);
    setMetaTag('meta[property="og:image"]', 'content', image);
    setMetaTag('meta[property="og:site_name"]', 'content', 'Amazing Kids of India');

    // 4. Twitter Cards
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', image);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }

    // 6. Structured Data (JSON-LD)
    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? 'Article' : 'WebSite',
      "name": fullTitle,
      "description": description,
      "url": url,
      "publisher": {
        "@type": "Organization",
        "name": "Amazing Kids of India",
        "logo": {
          "@type": "ImageObject",
          "url": image
        }
      }
    };

    let scriptTag = document.querySelector('#seo-jsonld');
    if (scriptTag) {
      scriptTag.innerHTML = JSON.stringify(jsonLdData);
    } else {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-jsonld';
      scriptTag.type = 'application/ld+json';
      scriptTag.innerHTML = JSON.stringify(jsonLdData);
      document.head.appendChild(scriptTag);
    }

    // Cleanup not strictly necessary as they get overwritten on next route, 
    // but prevents stale data if unmounted without a new useSEO hook.
  }, [title, description, keywords, author, url, image, type]);
};

export default useSEO;
