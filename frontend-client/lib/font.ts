import {
  Be_Vietnam_Pro,
  Geist,
  Instrument_Sans,
  Inter,
  JetBrains_Mono,
  Mulish,
  Noto_Sans_Mono
} from 'next/font/google';

import { cn } from '@/lib/utils';

const fontSans = Be_Vietnam_Pro({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans'
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

const fontInstrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument'
});

const fontNotoMono = Noto_Sans_Mono({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-noto-mono'
});

const fontMullish = Mulish({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-mullish'
});

const fontInter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter'
});

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInstrument.variable,
  fontNotoMono.variable,
  fontMullish.variable,
  fontInter.variable
);
