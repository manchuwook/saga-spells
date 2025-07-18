import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function sendToAnalytics(metric: WebVitalsMetric) {
  // In a real application, you would send this to your analytics service
  console.log('Web Vitals:', metric);

  // Example: Send to Google Analytics
  if ('gtag' in window) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.rating,
      non_interaction: true,
    });
  }
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

// Performance monitoring for development
export function logPerformanceMetrics() {
  if (process.env.NODE_ENV === 'development') {
    // Log performance metrics in development
    setTimeout(() => {
      const entries = performance.getEntriesByType('navigation');
      const navigation = entries[0];
      const paint = performance.getEntriesByType('paint');

      console.group('🚀 Performance Metrics');
      console.log(
        'DOM Content Loaded:',
        `${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`
      );
      console.log('Load Complete:', `${navigation.loadEventEnd - navigation.loadEventStart}ms`);
      console.log('First Paint:', paint.find((p) => p.name === 'first-paint')?.startTime);
      console.log(
        'First Contentful Paint:',
        paint.find((p) => p.name === 'first-contentful-paint')?.startTime
      );
      console.groupEnd();
    }, 2000);
  }
}
