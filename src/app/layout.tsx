
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { HabitProvider } from '@/context/HabitContext';
import Header from '@/components/Header';

const APP_NAME = "Habitual Streak";
const APP_DESCRIPTION = "Track your daily habits and build streaks.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
    // startUpImage: [], // You can add startup images here
  },
  formatDetection: {
    telephone: false,
  },
  // themeColor: "#64B5F6", // Defined in globals.css, but good to have here too
  // viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#64B5F6" />
        <link rel="apple-touch-icon" href="https://placehold.co/180x180.png" data-ai-hint="app icon" />
        {/* You would replace these with actual icon files in /public */}
        {/* <link rel="shortcut icon" href="/favicon.ico" /> */}
      </head>
      {/* Service worker registration */}
      <script>{`
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
              .then((reg) => {
                console.log('Service worker registered.', reg);
              })
              .catch((err) => {
                console.error('Service worker registration failed:', err);
              });
          });
        }
      `}</script>
      <body className="font-body antialiased">
        <HabitProvider>
          <Header />
          <main className="flex-grow container mx-auto p-4 sm:p-6">
            {children}
          </main>
          <Toaster />
        </HabitProvider>
      </body>
    </html>
  );
}
