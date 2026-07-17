// This page shows the full ID card and offers a PDF download.
import IDCard from '../components/IDCard';
import Navbar from '../components/Navbar';
import { PDFCardLink } from '../components/IDCardPDF';
import { useAuth } from '../context/AuthContext';

function CardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Your Digital ID Card</h2>
          <PDFCardLink name={user.name} userId={user.userId} role={user.role} batchOrDept={user.batchOrDept} validUntil={user.validUntil} qrToken={user.qrToken} phone={user.phone} email={user.email} photo={user.photo} />
        </div>
        <div className="spacer">
          <IDCard name={user.name} userId={user.userId} role={user.role} batchOrDept={user.batchOrDept} validUntil={user.validUntil} qrToken={user.qrToken} phone={user.phone} email={user.email} photo={user.photo} />
        </div>
      </div>
    </div>
  );
}

export default CardPage;
