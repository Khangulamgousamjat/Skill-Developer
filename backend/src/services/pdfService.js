import puppeteer from 'puppeteer';
import { generateQRCode } from './qrService.js';

/**
 * Generates a certificate PDF using Puppeteer.
 * @param {Object} data - Contains internName, certificateType, skillName, issueDate, verificationCode.
 * @param {string} templateHtml - The raw HTML template from the DB with {{PLACEHOLDERS}}.
 * @returns {Promise<Buffer>} - Respective PDF buffer.
 */
export const generateCertificatePDF = async (data, templateHtml) => {
  let browser = null;
  try {
    const { internName, certificateType, skillName, issueDate, verificationCode } = data;
    
    // Generate QR Code for the verification URL
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyPortal = `${frontendUrl}/verify/${verificationCode}`;
    const qrDataUrl = await generateQRCode(verifyPortal);

    // Default template if one isn't provided (Simplified fallback)
    let finalHtml = templateHtml || `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700&display=swap');
            body { font-family: 'Sora', sans-serif; background: #fff; color: #1E3A5F; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .certificate-wrapper { border: 15px solid #1E3A5F; padding: 60px; width: 950px; text-align: center; position: relative; box-sizing: border-box; }
            .certificate-wrapper::after { content: ""; position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px; border: 3px solid #F4A100; pointer-events: none; }
            h1 { font-size: 52px; margin: 0; color: #F4A100; text-transform: uppercase; letter-spacing: 3px; }
            h2 { font-size: 26px; margin: 15px 0 45px; color: #64748B; font-weight: 400; }
            .certify { font-size: 20px; font-weight: 500; font-family: 'DM Sans', sans-serif; }
            .intern-name { font-size: 56px; font-weight: 700; color: #1E3A5F; margin: 25px 0; border-bottom: 4px solid #00D2FF; display: inline-block; padding-bottom: 5px; }
            .description { font-size: 19px; line-height: 1.7; max-width: 650px; margin: 0 auto 50px auto; color: #475569; }
            .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 60px; }
            .signature-block { width: 250px; text-align: center; font-weight: 600; border-top: 2px solid #1E3A5F; padding-top: 10px; font-size: 18px; }
            .qr-id-block { display: flex; flex-direction: column; align-items: center; gap: 8px; }
            .qr-code img { width: 130px; height: 130px; }
            .verify-code { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #94A3B8; }
          </style>
        </head>
        <body>
          <div class="certificate-wrapper">
            <h1>Certificate of Completion</h1>
            <h2>Smart Skill & Live Learning Module</h2>
            <div class="certify">This is to certify that</div>
            <div class="intern-name">{{INTERN_NAME}}</div>
            <div class="description">
              Has successfully mastered the <strong>{{CERTIFICATE_TYPE}}</strong> track and demonstrated expert-level competence 
              in <strong>{{SKILL_NAME}}</strong>. Issued on {{ISSUE_DATE}} at [NRC INNOVATE-X].
            </div>
            <div class="footer">
              <div class="qr-id-block">
                <div class="qr-code"><img src="{{QR_CODE}}" /></div>
                <div class="verify-code">VERIFY: {{VERIFICATION_CODE}}</div>
              </div>
              <div class="signature-block">Course Director</div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Process Placeholders
    finalHtml = finalHtml
      .replace(/{{INTERN_NAME}}/g, internName)
      .replace(/{{CERTIFICATE_TYPE}}/g, certificateType || 'Module Completion')
      .replace(/{{SKILL_NAME}}/g, skillName || 'Core Curriculum')
      .replace(/{{ISSUE_DATE}}/g, issueDate)
      .replace(/{{VERIFICATION_CODE}}/g, verificationCode)
      .replace(/{{QR_CODE}}/g, qrDataUrl);

    // Puppeteer Rendering
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: 'new'
    });

    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
    
    const buffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    return buffer;
  } catch (err) {
    console.error('PDF Generation Error:', err);
    throw new Error('Failed to generate PDF document');
  } finally {
    if (browser) await browser.close();
  }
};
