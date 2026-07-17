import { QRCodeSVG } from 'qrcode.react';

function IDCard({ name, userId, role, batchOrDept, validUntil, qrToken, phone, email, photo }) {
  // Use user phone/email if available, else fall back to the reference screenshot defaults
  const userPhone = phone || '+123-456-7890';
  const userEmail = email || 'hello@reallygreatsite.com';

  return (
    <div className="id-card-wrapper">
      <div className="id-card">
        
        {/* FRONT SIDE */}
        <div className="id-card-front new-design">
          <div className="front-blue-shape">
            <div className="id-name">{name || 'DEEKSHA H S'}</div>
            <div className="id-role">{role || 'Student'}</div>
            <div className="id-photo-holder">
              {photo ? (
                <img src={photo} alt="Profile" className="id-photo-img" />
              ) : (
                <svg viewBox="0 0 100 100" className="id-photo-placeholder">
                  <rect width="100" height="100" fill="#d8eff7" />
                  <path d="M0,100 L0,70 Q25,60 50,75 T100,60 L100,100 Z" fill="#a4c639" />
                  <path d="M0,100 L0,80 Q20,70 40,85 T100,70 L100,100 Z" fill="#7cb342" opacity="0.8" />
                  <circle cx="35" cy="35" r="12" fill="white" />
                  <circle cx="50" cy="30" r="16" fill="white" />
                  <circle cx="65" cy="35" r="12" fill="white" />
                </svg>
              )}
            </div>
          </div>
          
          <div className="front-contact-info">
            <div className="id-contact-item">
              <span>{userPhone}</span>
              <div className="id-contact-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>
                </svg>
              </div>
            </div>
            <div className="id-contact-item">
              <span>{userEmail}</span>
              <div className="id-contact-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="id-card-back new-design">
          <div className="back-left-content">
            <div className="logo-subtext-new" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>ORGANIZATION NAME</div>
            <div className="back-website">https://example.com/</div>
          </div>
          
          <div className="back-blue-shape">
            <div className="back-qr-holder">
              <QRCodeSVG 
                value={qrToken || 'placeholder'} 
                size={90} 
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
              />
            </div>
            <div className="back-date">{validUntil || '31/09/2030'}</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default IDCard;
