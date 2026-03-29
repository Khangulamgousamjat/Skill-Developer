import pool from '../config/db.js';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';

// ─── GET /api/certificates ──────────────────────────────────────────
export const getMyCertificates = async (req, res) => {
  const internId = req.user.id;
  
  try {
    // In a production app, we would query the `certificates` table.
    // For this demonstration, we'll check if they've completed onboarding
    // to dynamically assign an "SSLLM Onboarding Verified" certificate.
    
    const userResult = await pool.query(`SELECT full_name, onboarding_completed FROM users WHERE id = $1`, [internId]);
    if (userResult.rowCount === 0) return res.status(404).json({ success: false, message: 'User not found.' });
    
    const user = userResult.rows[0];

    // Mock Database Return
    const certificates = [
      {
        id: 1,
        title: 'React.js Fundamentals',
        type: 'Skill Certificate',
        issued: new Date().toLocaleDateString(),
        code: `NRC-CERT-${internId.substring(0,6)}-REACT`,
        color: '#3B82F6',
        earned: true,
      },
      {
        id: 2,
        title: 'Platform Orientation completed',
        type: 'Onboarding Module',
        issued: user.onboarding_completed ? new Date().toLocaleDateString() : 'Pending',
        code: user.onboarding_completed ? `NRC-CERT-${internId.substring(0,6)}-ONB` : null,
        color: '#22C55E',
        earned: user.onboarding_completed,
      },
      {
        id: 3,
        title: 'Full Stack SSLLM Mastery',
        type: 'Program Completion',
        issued: 'Not yet earned',
        code: null,
        color: '#F4A100',
        earned: false,
      }
    ];

    res.json({ success: true, data: certificates });
  } catch (err) {
    console.error('Fetch certs error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving certificates.' });
  }
};

// ─── GET /api/certificates/download/:code ──────────────────────────────
export const downloadCertificate = async (req, res) => {
  const { code } = req.params;
  const internName = req.user.full_name || 'Valued Intern';

  try {
    // Generate QR Code Base64
    // We point the QR code to the platform's verification page (hypothetical)
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${code}`;
    const qrImageBase64 = await QRCode.toDataURL(verificationUrl);

    // Build the dynamic HTML payload that Puppeteer will render
    const htmlContent = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700&display=swap');
            body { 
              font-family: 'Sora', sans-serif; 
              margin: 0; 
              padding: 0; 
              background: #fff;
              color: #1E3A5F;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              width: 100vw;
            }
            .certificate {
              border: 15px solid #1E3A5F;
              padding: 50px;
              width: 900px;
              text-align: center;
              position: relative;
            }
            .certificate::before {
              content: "";
              position: absolute;
              top: 15px; left: 15px; right: 15px; bottom: 15px;
              border: 3px solid #F4A100;
            }
            h1 { font-size: 50px; margin: 0; color: #F4A100; text-transform: uppercase; letter-spacing: 2px; }
            h2 { font-size: 24px; margin: 10px 0 40px; color: #64748b; font-weight: 400; }
            .certify { font-size: 18px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
            .name { font-size: 48px; font-weight: 700; color: #1E3A5F; margin-bottom: 20px; text-decoration: underline; text-decoration-color: #00D2FF;}
            .reason { font-size: 18px; line-height: 1.6; max-width: 600px; margin: 0 auto 50px auto; }
            .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px; }
            .signature { border-top: 2px solid #1E3A5F; padding-top: 10px; width: 250px; font-weight: bold; }
            .qr-code img { width: 120px; height: 120px; }
            .cert-id { font-size: 12px; color: #94a3b8; font-family: monospace; margin-top: 5px;}
          </style>
        </head>
        <body>
          <div class="certificate">
            <h1>Certificate of Completion</h1>
            <h2>NRC INNOVATE-X Intern Training Module</h2>
            
            <div class="certify">This certifies that</div>
            <div class="name">${internName}</div>
            <div class="reason">
              Has successfully fulfilled all required constraints and demonstrated outstanding capability in the designated learning path to achieve this credential.
            </div>

            <div class="footer">
              <div class="qr-code">
                 <img src="${qrImageBase64}" alt="Verification QR Code" />
                 <div class="cert-id">ID: ${code}</div>
              </div>
              <div class="signature">Authorized Signature</div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Spin up Puppeteer headless browser
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Print to PDF mapping A4 landscape dimensions
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true
    });
    
    await browser.close();

    // Stream the resultant Buffer directly to the client
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `attachment; filename="NRC-CERTIFICATE-${code}.pdf"`
    });

    res.send(pdfBuffer);

  } catch (err) {
    console.error('Puppeteer generation error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate PDF locally.' });
  }
};
