// Seed comment: This component integrates the html5-qrcode library to scan QR codes stably and release the camera stream when unmounted.
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

function QRScanner({ onScan }) {
  const onScanRef = useRef(onScan);

  // Keep the callback ref up to date
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let scanner = null;

    // Use a short timeout to debounce React 18 Strict Mode's rapid mount/unmount cycle.
    // This prevents two scanners from being initialized simultaneously.
    const initTimer = setTimeout(() => {
      const readerElement = document.getElementById('reader');
      // Only initialize if the container is empty to avoid duplicating the UI
      if (readerElement && readerElement.innerHTML === '') {
        scanner = new Html5QrcodeScanner(
          'reader',
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          false
        );

        scanner.render(
          (decodedText) => {
            if (onScanRef.current) {
              onScanRef.current(decodedText);
            }
          },
          () => {
            // Quiet capture error handler
          }
        );
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (scanner) {
        scanner.clear().catch((error) => {
          console.warn('Failed to clear html5-qrcode scanner during unmount:', error);
        });
      }
    };
  }, []);

  return (
    <div className="scanner-box">
      <h3>Scan QR Attendance Code</h3>
      <p>Point your camera at the digital or printed student/employee ID card.</p>
      <div id="reader" style={{ width: '100%', maxWidth: 420, margin: '0 auto' }} />
    </div>
  );
}

export default QRScanner;
