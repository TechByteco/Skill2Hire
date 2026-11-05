import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Skill2Hire — Learn. Verify. Get Hired.',
  description: 'AI-Powered Student–College–Company Job & Skill Development Hub connecting verified talent with top tech companies. Built by Saalimin N. For students who are working towards their first opportunity.',
  authors: [{ name: 'Saalimin N' }],
  creator: 'Saalimin N',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
