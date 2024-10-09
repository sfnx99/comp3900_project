import * as QRCode from 'qrcode'

export async function generateQR(information: any) {
    try {
      const qrCodeUrl = await QRCode.toDataURL(information);
      return(qrCodeUrl);
    } catch (err) {
      console.error(err);
    }
};
