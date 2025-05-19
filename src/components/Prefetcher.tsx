import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Define a map of routes to their respective page components
type RouteImportMap = {
  [key: string]: () => Promise<any>;
}

/**
 * Component for prefetching important data and resources for performance optimization
 */
export function Prefetcher() {
  const location = useLocation();
  const [prefetchedRoutes, setPrefetchedRoutes] = useState<Set<string>>(new Set());

  // Map routes to their respective lazy-loaded components
  const routeImportMap: RouteImportMap = {
    '/': () => import('../pages/SpellsPage'),
    '/spellbooks': () => import('../pages/SpellbooksPage'),
    '/spellbooks/': () => import('../pages/SpellbookDetailPage'),
  };

  // Prefetch critical resources on initial render
  useEffect(() => {
    prefetchInitialResources();
  }, []);
  
  // Prefetch adjacent routes when location changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      prefetchAdjacentRoutes();
    }
  }, [location.pathname]);
  
  // Function to prefetch initial critical resources
  const prefetchInitialResources = async () => {
    try {
      // Prefetch spell data with priority hints
      fetch('/spells.json', { priority: 'high' });
      
      // Prefetch spell tags data
      fetch('/spells.tags.json', { priority: 'high' });
      
      // Prefetch critical images
      prefetchCriticalImages();
      
      // Setup preconnect links
      setupPreconnect();
      
      // When not in development, prefetch next probable routes
      if (process.env.NODE_ENV === 'production') {
        prefetchAdjacentRoutes();
      }
    } catch (error) {
      console.error('Error prefetching resources:', error);
    }
  };
  
  // Function to prefetch critical images
  const prefetchCriticalImages = () => {
    const criticalImages = ['/assets/img/parchment1.png'];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  };
  
  // Function to set up preconnect for external resources
  const setupPreconnect = () => {
    const domains = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
    
    domains.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  };
  
  // Function to prefetch adjacent routes based on current location
  const prefetchAdjacentRoutes = () => {
    const currentRoute = location.pathname;
    const routesToPrefetch: string[] = [];
    
    if (currentRoute === '/') {
      routesToPrefetch.push('/spellbooks');
    } else if (currentRoute.startsWith('/spellbooks') && !currentRoute.includes('/')) {
      routesToPrefetch.push('/spellbooks/');
    } else if (currentRoute.includes('/spellbooks/')) {
      routesToPrefetch.push('/spellbooks');
      
      // Prefetch PDF export on spellbook detail pages
      if (import.meta.env.PROD) {
        setTimeout(() => {
          import('../lib/pdfExport.enhanced').catch(console.error);
        }, 2000);
      }
    }
    
    // Process routes to prefetch
    for (const route of routesToPrefetch) {
      if (!prefetchedRoutes.has(route) && routeImportMap[route]) {
        prefetchRoute(route);
      }
    }
  };
  
  // Function to prefetch a single route
  const prefetchRoute = (route: string) => {
    setTimeout(() => {
      routeImportMap[route]()
        .then(() => {
          setPrefetchedRoutes(prev => new Set([...prev, route]));
        })
        .catch(error => {
          console.error(`Error prefetching route ${route}:`, error);
        });
    }, 1000);
  };
  
  // This component doesn't render anything
  return null;
}
