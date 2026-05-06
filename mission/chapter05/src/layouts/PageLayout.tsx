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
    <main className="mx-auto min-h-screen w-full max-w-4xl bg-slate-50 px-6 py-8 text-slate-900">
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      <p className="text-sm text-slate-500">{description}</p>
      <p className="mt-3 text-sm">
        <strong>현재 경로:</strong> {location.pathname}
      </p>
      {hasParams ? (
        <pre className="mt-3 rounded-lg bg-white p-3 text-xs shadow ring-1 ring-slate-200">
          {JSON.stringify(params, null, 2)}
        </pre>
      ) : null}
      {children}
    </main>
  );
}

export default PageLayout;
