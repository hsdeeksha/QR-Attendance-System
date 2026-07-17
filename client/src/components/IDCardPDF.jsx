import { Document, Page, Text, View, Image, StyleSheet, PDFDownloadLink, Svg, Path, Rect, Circle } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    backgroundColor: '#f5f5f5', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  cardContainer: {
    width: 320,
    height: 200,
    backgroundColor: '#ffffff', 
    borderRadius: 12, 
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #eaeaea'
  },
  // Front Layout
  frontBlueShape: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '46%',
    height: '100%',
    backgroundColor: '#060b33',
    borderTopRightRadius: 70,
    paddingTop: 24,
    alignItems: 'center'
  },
  name: { 
    fontSize: 16,
    fontWeight: 'bold', 
    color: 'white', 
    textTransform: 'uppercase', 
    marginBottom: 4,
    fontFamily: 'Times-Roman'
  },
  role: { 
    fontSize: 11,
    color: 'white', 
    fontStyle: 'italic',
    textTransform: 'uppercase',
    marginBottom: 16,
    fontFamily: 'Times-Italic'
  },
  photoHolder: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  contactInfo: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 9,
    color: '#060b33',
    marginRight: 6
  },
  contactIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#060b33',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Back Layout
  backBlueShape: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '46%',
    height: '100%',
    backgroundColor: '#060b33',
    borderTopLeftRadius: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backLeftContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '54%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  logoSubtext: {
    fontSize: 4,
    fontWeight: 'bold', 
    color: '#1a1a2e',
    marginTop: 2,
    textAlign: 'center'
  },
  backWeb: {
    fontSize: 10,
    color: '#060b33',
    marginTop: 8,
    fontFamily: 'Times-Roman'
  },
  qrBox: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 6,
    marginBottom: 10
  },
  qrImage: {
    width: 75,
    height: 75
  },
  validDate: {
    color: 'white',
    fontSize: 10
  }
});

function IDCardPDF({ name, userId, role, batchOrDept, validUntil, qrToken, phone, email, photo }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    const generate = async () => {
      const url = await QRCode.toDataURL(qrToken || 'placeholder', { margin: 0 });
      setQrDataUrl(url);
    };
    generate();
  }, [qrToken]);

  const userPhone = phone || '+123-456-7890';
  const userEmail = email || 'hello@reallygreatsite.com';

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* FRONT SIDE */}
        <View style={styles.cardContainer}>
          <View style={styles.frontBlueShape}>
            <Text style={styles.name}>{name || 'DEEKSHA H S'}</Text>
            <Text style={styles.role}>{role || 'Student'}</Text>
            <View style={styles.photoHolder}>
              {photo ? (
                <Image src={photo} style={styles.photoImg} />
              ) : (
                <Svg viewBox="0 0 100 100" style={{ width: 90, height: 90 }}>
                  <Rect width="100" height="100" fill="#d8eff7" />
                  <Path d="M0,100 L0,70 Q25,60 50,75 T100,60 L100,100 Z" fill="#a4c639" />
                  <Path d="M0,100 L0,80 Q20,70 40,85 T100,70 L100,100 Z" fill="#7cb342" fillOpacity={0.8} />
                  <Circle cx="35" cy="35" r="12" fill="white" />
                  <Circle cx="50" cy="30" r="16" fill="white" />
                  <Circle cx="65" cy="35" r="12" fill="white" />
                </Svg>
              )}
            </View>
          </View>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>{userPhone}</Text>
              <View style={styles.contactIcon}>
                <Svg width="8" height="8" viewBox="0 0 24 24">
                  <Path fill="#ffffff" d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>
                </Svg>
              </View>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>{userEmail}</Text>
              <View style={styles.contactIcon}>
                <Svg width="8" height="8" viewBox="0 0 24 24">
                  <Path fill="#ffffff" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </Svg>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />

        {/* BACK SIDE */}
        <View style={styles.cardContainer}>
          <View style={styles.backLeftContent}>
            <View style={styles.logoBox}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1a1a2e', marginTop: 10, textAlign: 'center' }}>ORGANIZATION NAME</Text>
            </View>
            <Text style={styles.backWeb}>https://example.com/</Text>
          </View>
          
          <View style={styles.backBlueShape}>
            <View style={styles.qrBox}>
              {qrDataUrl ? <Image src={qrDataUrl} style={styles.qrImage} /> : null}
            </View>
            <Text style={styles.validDate}>{validUntil || '31/09/2030'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export function PDFCardLink({ name, userId, role, batchOrDept, validUntil, qrToken, phone, email, photo }) {
  return (
    <PDFDownloadLink 
      document={
        <IDCardPDF 
          name={name} 
          userId={userId} 
          role={role} 
          batchOrDept={batchOrDept} 
          validUntil={validUntil} 
          qrToken={qrToken} 
          phone={phone} 
          email={email} 
          photo={photo}
        />
      } 
      fileName={`ID-Card-${userId || 'guest'}.pdf`}
    >
      {({ loading }) => (
        <button className="primary-btn">
          {loading ? 'Preparing PDF...' : 'Download as PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}

export default IDCardPDF;
