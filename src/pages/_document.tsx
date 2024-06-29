import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Soksok</title>
        <meta name="title" content="Soksok" />
        <meta name="description" content="Soksok needs food" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://family-bill-app.vercel.app/" />
        <meta property="og:title" content="Soksok" />
        <meta property="og:description" content="Soksok needs food" />
        <meta
          property="og:image"
          content="https://family-bill-app.vercel.app/images/soksok.jpg"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://family-bill-app.vercel.app/" />
        <meta property="twitter:title" content="Soksok" />
        <meta property="twitter:description" content="Soksok needs food" />
        <meta
          property="twitter:image"
          content="https://family-bill-app.vercel.app/images/soksok.jpg"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
