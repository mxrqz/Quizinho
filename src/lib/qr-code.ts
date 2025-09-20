import QRCode from 'qrcode';
import axios from 'axios';

export const qrCodeService = {
  // Generate QR code as base64 data URL
  async generateQrCode(url: string): Promise<string | null> {
    try {
      return await QRCode.toDataURL(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  },

  // Upload QR code to ImgBB with expiration
  async uploadQrCodeToImgBB(id: string, base64Image: string, plan: string): Promise<string | null> {
    try {
      const bbApiKey = process.env.IMGBB_API_KEY;

      if (!bbApiKey || bbApiKey === 'example_key') {
        console.warn('ImgBB API key not configured, using placeholder URL');
        return `https://example.com/qr-placeholder-${id}.png`;
      }

      const dias = plan === 'free' ? 7 : 30;
      const duration = dias * 24 * 60 * 60; // seconds
      const imgBBURL = `https://api.imgbb.com/1/upload?expiration=${duration}&key=${bbApiKey}`;

      const response = await axios.post(imgBBURL, {
        image: base64Image,
        name: id
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data.url;
    } catch (error) {
      console.error('Error uploading QR code to ImgBB:', error);
      return null;
    }
  },

  // Generate and upload QR code in one step
  async createAndUploadQrCode(quizinhoURL: string, id: string, plan: string): Promise<string | null> {
    try {
      const qrCode = await this.generateQrCode(quizinhoURL);
      if (!qrCode) return null;

      const base64Data = qrCode.replace(/^data:image\/png;base64,/, '');
      return await this.uploadQrCodeToImgBB(id, base64Data, plan);
    } catch (error) {
      console.error('Error creating and uploading QR code:', error);
      return null;
    }
  }
};