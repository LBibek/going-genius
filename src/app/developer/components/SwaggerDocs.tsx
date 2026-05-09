'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import to avoid SSR issues with swagger-ui
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export function SwaggerDocs({ specUrl }: { specUrl: string }) {
  return (
    <div className="swagger-wrapper">
      <SwaggerUI
        url={specUrl}
        docExpansion="list"
        defaultModelsExpandDepth={-1}
        tryItOutEnabled={true}
      />
      <style>{`
        .swagger-wrapper .swagger-ui .topbar { display: none; }
        .swagger-wrapper .swagger-ui { font-family: inherit; }
        .swagger-wrapper .swagger-ui .info { margin: 0 0 2rem; }
        .swagger-wrapper .swagger-ui .info .title { font-size: 1.5rem; color: var(--foreground); }
        .swagger-wrapper .swagger-ui .scheme-container { background: transparent; box-shadow: none; border-bottom: 1px solid var(--border); }
        .swagger-wrapper .swagger-ui input, .swagger-wrapper .swagger-ui select, .swagger-wrapper .swagger-ui textarea {
          background: rgba(255,255,255,0.05); border-color: var(--border); color: var(--foreground);
        }
        .swagger-wrapper .swagger-ui .opblock-tag { border-bottom: 1px solid var(--border); }
        .swagger-wrapper .swagger-ui .opblock { border-radius: 10px; overflow: hidden; margin-bottom: 0.75rem; }
      `}</style>
    </div>
  );
}
