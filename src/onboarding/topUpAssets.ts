import type { TopUpBankId } from './bankRequisites';
import tbankQr from '../assets/onboarding/demo-top-up-qr.svg';
import tbankPdf from '../assets/onboarding/demo-top-up.pdf?url';
import tbankXlsx from '../assets/onboarding/demo-top-up.xlsx?url';
import tbankRequisites from '../assets/onboarding/demo-requisites.pdf?url';
import dolinskQr from '../assets/onboarding/demo-top-up-qr-dolinsk.svg';
import dolinskPdf from '../assets/onboarding/demo-top-up-dolinsk.pdf?url';
import dolinskXlsx from '../assets/onboarding/demo-top-up-dolinsk.xlsx?url';
import dolinskRequisites from '../assets/onboarding/demo-requisites-dolinsk.pdf?url';
import tkbQr from '../assets/onboarding/demo-top-up-qr-tkb.svg';
import tkbPdf from '../assets/onboarding/demo-top-up-tkb.pdf?url';
import tkbXlsx from '../assets/onboarding/demo-top-up-tkb.xlsx?url';
import tkbRequisites from '../assets/onboarding/demo-requisites-tkb.pdf?url';

export const TOP_UP_ASSETS: Record<
  TopUpBankId,
  {
    qr: string;
    PDF: string;
    XLSX: string;
    requisites: string;
  }
> = {
  tbank: {
    qr: tbankQr,
    PDF: tbankPdf,
    XLSX: tbankXlsx,
    requisites: tbankRequisites,
  },
  dolinsk: {
    qr: dolinskQr,
    PDF: dolinskPdf,
    XLSX: dolinskXlsx,
    requisites: dolinskRequisites,
  },
  tkb: { qr: tkbQr, PDF: tkbPdf, XLSX: tkbXlsx, requisites: tkbRequisites },
};
