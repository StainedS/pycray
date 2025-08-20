import type { ReactNode } from 'react';
import { ThemeProvider } from './providers/theme';

type DesignSystemProviderProps = {
  readonly children: ReactNode;
};

export const DesignSystemProvider = ({
  children,
}: DesignSystemProviderProps) => <ThemeProvider>{children}</ThemeProvider>;
