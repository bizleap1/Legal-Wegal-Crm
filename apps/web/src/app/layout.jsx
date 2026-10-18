import './globals.css';
export const metadata = {
  title: 'Legal Wegal — Lead Management CRM',
  description: 'Enterprise Lead Management CRM with Meta Lead Ads, WhatsApp Business, Website Forms, and Google Ads attribution.'
};
export default function RootLayout({
  children
}) {
  return <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>;
}