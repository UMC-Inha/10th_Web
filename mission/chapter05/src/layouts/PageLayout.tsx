import type { ReactNode } from 'react';
import { useLocation, useParams } from 'react-router';

type PageLayoutProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

function PageLayout({ title, description, children }: PageLayoutProps) {
  const location = useLocation();
  const params = useParams();
  const hasParams = Object.keys(params).length > 0;

  return (
    <main style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '8px' }}>{title}</h1>
      <p style={{ marginTop: 0, color: '#666' }}>{description}</p>
      <p style={{ margin: '12px 0 0' }}>
        <strong>현재 경로:</strong> {location.pathname}
      </p>
      {hasParams ? (
        <pre style={{ marginTop: '12px', background: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
          {JSON.stringify(params, null, 2)}
        </pre>
      ) : null}
      {children}
    </main>
  );
}

export default PageLayout;
