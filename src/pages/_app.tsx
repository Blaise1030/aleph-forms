import {Hydrate, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ThemeProvider} from "@/components/theme-provider";
import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {Toaster} from "@/components/ui/toaster";
import React from "react";

function App({Component, pageProps}: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default App;
