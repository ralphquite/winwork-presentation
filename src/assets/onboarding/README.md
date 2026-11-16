# WinWork onboarding assets

SVGs were copied unchanged from the user-authorized WinWork dev frontend (`my-smz-partner-front-dev.apibank.tech`) inspected on 2026-09-21. Hashed export names were normalized for deterministic imports. These are interface assets, not full-screen captures. Do not replace them with approximations.

Roboto and Montserrat WOFF2 subsets match the Google Fonts assets loaded by the same interface. Cyrillic and Latin subsets are embedded in the offline output. On 2026-09-25, live computed styles reconfirmed both families. The original subsets lack U+20BD (₽); `roboto-ruble.woff2` and `montserrat-ruble.woff2` add that single glyph at weights 100–900, downloaded from the official Google Fonts CSS API with `text=%E2%82%BD`. They are loaded under the same existing family aliases with `unicode-range: U+20BD` and embedded offline, with no runtime Google Fonts request. Font licenses are kept alongside the files and included in the single HTML artifact.

## Synthetic top-up assets

Each bank has a matching set of locally authored fixtures: invoice PDF/XLSX, requisites PDF and QR SVG. Т-банк retains the base filenames `demo-top-up.pdf`, `demo-top-up.xlsx`, `demo-requisites.pdf` and `demo-top-up-qr.svg`; Банк Долинск and ТКБ add `-dolinsk` and `-tkb` before the extension. `topUpAssets.ts` imports all twelve assets into the same offline build.

The files were regenerated on 2026-09-27 from `TOP_UP_BANKS`, `getBankRequisites()` and `DEMO_PAYMENT_PURPOSE` in `bankRequisites.ts`. Invoice amount is fixed at 25,000 rubles (numeric in XLSX); PDF/XLSX are explicitly marked as non-payment examples. PDFs use embedded DejaVu Sans and ReportLab, spreadsheets use openpyxl. QR SVGs use ReportLab and encode only `WINWORK DEMO - NOT FOR PAYMENT - <BANK_ID>`, without a payment payload or URL. They visibly change with the shared bank selection but cannot initiate a transfer. The user requested removing the caption below the on-screen QR; its payload remains a safe demo marker.
