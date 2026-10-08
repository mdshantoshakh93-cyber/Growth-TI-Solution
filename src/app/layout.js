import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Growth IT Solution | Next-Generation Enterprise Engineering Platform',
  description: 'Architecting high-scale cloud infrastructure, custom autonomous agentic AI models, Next.js web applications, and Zero-Trust cybersecurity.',
  keywords: ['Growth IT Solution', 'Next.js 15', 'Cloud DevOps', 'AI Agents', 'Cybersecurity', 'Web Engineering'],
  authors: [{ name: 'Growth IT Solution Team' }],
  openGraph: {
    title: 'Growth IT Solution | Next-Gen Enterprise Engineering',
    description: 'Enterprise Cloud Architecture, Agentic AI Systems, Next.js Web Engineering, and Cybersecurity Auditing.',
    url: 'https://growthitsolution.com',
    siteName: 'Growth IT Solution',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-gray-100 antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
