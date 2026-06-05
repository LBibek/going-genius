'use client';

import { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white" style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
      {/* 
        We invert the colors because Swagger UI doesn't have a built-in dark mode that looks good,
        and our entire app is dark mode. This CSS trick gives a decent dark theme for Swagger UI.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        .swagger-ui .info .title, .swagger-ui .info p, .swagger-ui .opblock .opblock-summary-method, .swagger-ui .opblock .opblock-summary-path {
          color: #333 !important;
        }
        .swagger-ui { filter: invert(0); }
      `}} />
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <SwaggerUI url="/api/docs/openapi.json" />
      </div>
    </div>
  );
}
