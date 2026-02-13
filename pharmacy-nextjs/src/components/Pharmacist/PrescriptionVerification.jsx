'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const PrescriptionVerification = ({ onStatsUpdate }) => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [showNewPrescriptionForm, setShowNewPrescriptionForm] = useState(false);

  useEffect(() => {
    fetchPendingPrescriptions();
  }, []);

  const fetchPendingPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/modules/prescriptions.php?action=pending');
      const data = await response.json();
      if (data.success) {
        setPrescriptions(data.data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptionDetails = async (prescriptionId) => {
    try {
      const response = await fetch(`/api/modules/prescriptions.php?action=details&id=${prescriptionId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedPrescription(data.data);
      }
    } catch (error) {
      console.error('Error fetching prescription details:', error);
    }
  };

  const verifyPrescription = async (prescriptionId, approved = true) => {
    try {
      const response = await fetch('/api/modules/prescriptions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          prescription_id: prescriptionId,
          verified_by: user.user_id,
          notes: verificationNotes,
          status: approved ? 'verified' : 'rejected'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(approved ? 'Prescription verified successfully!' : 'Prescription rejected');
        setSelectedPrescription(null);
        setVerificationNotes('');
        fetchPendingPrescriptions();
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error verifying prescription:', error);
      alert('Error verifying prescription');
    }
  };

  const checkDrugInteractions = async (medicines) => {
    try {
      const response = await fetch('/api/modules/drug_interactions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_multiple',
          drugs: medicines.map(m => m.medicine_name)
        })
      });

      const data = await response.json();
      if (data.success && data.interactions.length > 0) {
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error checking drug interactions:', error);
      return null;
    }
  };

  const handlePrescriptionClick = async (prescription) => {
    await fetchPrescriptionDetails(prescription.prescription_id);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>📋 Prescription Verification</h2>
        <button
          onClick={() => setShowNewPrescriptionForm(true)}
          style={addButtonStyle}
        >
          ➕ New Prescription
        </button>
      </div>

      <div style={contentGridStyle}>
        {/* Prescriptions List */}
        <div style={listContainerStyle}>
          <h3 style={sectionTitleStyle}>Pending Prescriptions ({prescriptions.length})</h3>
          
          {loading ? (
            <div style={loadingStyle}>Loading prescriptions...</div>
          ) : prescriptions.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <p>No pending prescriptions</p>
            </div>
          ) : (
            <div style={prescriptionListStyle}>
              {prescriptions.map(prescription => (
                <div
                  key={prescription.prescription_id}
                  onClick={() => handlePrescriptionClick(prescription)}
                  style={{
                    ...prescriptionCardStyle,
                    ...(selectedPrescription?.prescription_id === prescription.prescription_id ? selectedCardStyle : {})
                  }}
                >
                  <div style={cardHeaderStyle}>
                    <div>
                      <div style={prescriptionNumberStyle}>
                        {prescription.prescription_number}
                      </div>
                      <div style={patientNameStyle}>
                        {prescription.patient_name}
                      </div>
                    </div>
                    <div style={urgencyBadgeStyle}>
                      {prescription.item_count} items
                    </div>
                  </div>
                  
                  <div style={cardDetailsStyle}>
                    <div>👨‍⚕️ Dr. {prescription.doctor_name}</div>
                    <div>📅 {new Date(prescription.prescription_date).toLocaleDateString()}</div>
                    <div>⏰ {new Date(prescription.created_at).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prescription Details */}
        <div style={detailsContainerStyle}>
          {selectedPrescription ? (
            <div>
              <div style={detailsHeaderStyle}>
                <h3 style={sectionTitleStyle}>Prescription Details</h3>
                <div style={statusBadgeStyle}>
                  {selectedPrescription.status}
                </div>
              </div>

              {/* Patient Information */}
              <div style={sectionStyle}>
                <h4 style={subsectionTitleStyle}>👤 Patient Information</h4>
                <div style={infoGridStyle}>
                  <div><strong>Name:</strong> {selectedPrescription.patient_name}</div>
                  <div><strong>Phone:</strong> {selectedPrescription.phone || 'N/A'}</div>
                  <div><strong>Allergies:</strong> {selectedPrescription.allergies || 'None reported'}</div>
                  <div><strong>Medical Conditions:</strong> {selectedPrescription.medical_conditions || 'None reported'}</div>
                </div>
              </div>

              {/* Doctor Information */}
              <div style={sectionStyle}>
                <h4 style={subsectionTitleStyle}>👨‍⚕️ Prescriber Information</h4>
                <div style={infoGridStyle}>
                  <div><strong>Doctor:</strong> Dr. {selectedPrescription.doctor_name}</div>
                  <div><strong>License:</strong> {selectedPrescription.doctor_license || 'N/A'}</div>
                  <div><strong>Date:</strong> {new Date(selectedPrescription.prescription_date).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Prescribed Medicines */}
              <div style={sectionStyle}>
                <h4 style={subsectionTitleStyle}>💊 Prescribed Medicines</h4>
                <div style={medicineListStyle}>
                  {selectedPrescription.items?.map((item, index) => (
                    <div key={index} style={medicineItemStyle}>
                      <div style={medicineHeaderStyle}>
                        <div>
                          <div style={medicineNameStyle}>{item.medicine_name}</div>
                          {item.generic_name && (
                            <div style={genericNameStyle}>({item.generic_name})</div>
                          )}
                        </div>
                        <div style={quantityBadgeStyle}>
                          Qty: {item.quantity_prescribed}
                        </div>
                      </div>
                      
                      <div style={medicineDetailsStyle}>
                        <div><strong>Dosage:</strong> {item.dosage}</div>
                        <div><strong>Instructions:</strong> {item.instructions}</div>
                        {item.frequency && <div><strong>Frequency:</strong> {item.frequency}</div>}
                        {item.duration && <div><strong>Duration:</strong> {item.duration}</div>}
                        {item.available_quantity !== null && (
                          <div style={stockInfoStyle}>
                            <strong>Available Stock:</strong> {item.available_quantity}
                            {item.available_quantity < item.quantity_prescribed && (
                              <span style={lowStockWarningStyle}> ⚠️ Insufficient stock</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drug Interaction Check */}
              <div style={sectionStyle}>
                <button
                  onClick={async () => {
                    const interactions = await checkDrugInteractions(selectedPrescription.items);
                    if (interactions && interactions.warnings.length > 0) {
                      alert(`Drug Interactions Found:\n${interactions.warnings.map(w => w.message).join('\n')}`);
                    } else {
                      alert('No drug interactions found');
                    }
                  }}
                  style={checkInteractionsButtonStyle}
                >
                  ⚠️ Check Drug Interactions
                </button>
              </div>

              {/* Verification Notes */}
              <div style={sectionStyle}>
                <h4 style={subsectionTitleStyle}>📝 Verification Notes</h4>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Add verification notes, concerns, or recommendations..."
                  style={textareaStyle}
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div style={actionButtonsStyle}>
                <button
                  onClick={() => verifyPrescription(selectedPrescription.prescription_id, false)}
                  style={rejectButtonStyle}
                >
                  ❌ Reject
                </button>
                <button
                  onClick={() => verifyPrescription(selectedPrescription.prescription_id, true)}
                  style={approveButtonStyle}
                >
                  ✅ Verify & Approve
                </button>
              </div>
            </div>
          ) : (
            <div style={emptyDetailsStyle}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
              <h3>Select a prescription to review</h3>
              <p>Click on a prescription from the list to view details and verify</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  height: '100%'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px'
};

const titleStyle = {
  margin: 0,
  color: '#2d3748',
  fontSize: '1.5rem'
};

const addButtonStyle = {
  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600'
};

const contentGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
  height: 'calc(100vh - 300px)'
};

const listContainerStyle = {
  background: '#f7fafc',
  borderRadius: '12px',
  padding: '20px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const detailsContainerStyle = {
  background: '#f7fafc',
  borderRadius: '12px',
  padding: '20px',
  overflow: 'auto'
};

const sectionTitleStyle = {
  margin: '0 0 16px 0',
  color: '#2d3748',
  fontSize: '1.1rem'
};

const prescriptionListStyle = {
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const prescriptionCardStyle = {
  background: '#fff',
  borderRadius: '8px',
  padding: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  border: '2px solid transparent'
};

const selectedCardStyle = {
  borderColor: '#3182ce',
  boxShadow: '0 4px 12px rgba(49, 130, 206, 0.2)'
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px'
};

const prescriptionNumberStyle = {
  fontWeight: '600',
  color: '#3182ce',
  fontSize: '14px'
};

const patientNameStyle = {
  fontWeight: '600',
  color: '#2d3748',
  fontSize: '16px'
};

const urgencyBadgeStyle = {
  background: '#e2e8f0',
  color: '#4a5568',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '500'
};

const cardDetailsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  fontSize: '12px',
  color: '#718096'
};

const loadingStyle = {
  textAlign: 'center',
  padding: '40px',
  color: '#718096'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '40px',
  color: '#718096'
};

const emptyDetailsStyle = {
  textAlign: 'center',
  padding: '60px 20px',
  color: '#718096'
};

const detailsHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px'
};

const statusBadgeStyle = {
  background: '#fed7d7',
  color: '#c53030',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase'
};

const sectionStyle = {
  marginBottom: '24px'
};

const subsectionTitleStyle = {
  margin: '0 0 12px 0',
  color: '#4a5568',
  fontSize: '14px',
  fontWeight: '600'
};

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
  fontSize: '14px',
  color: '#2d3748'
};

const medicineListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const medicineItemStyle = {
  background: '#fff',
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid #e2e8f0'
};

const medicineHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px'
};

const medicineNameStyle = {
  fontWeight: '600',
  color: '#2d3748',
  fontSize: '16px'
};

const genericNameStyle = {
  color: '#718096',
  fontSize: '14px',
  fontStyle: 'italic'
};

const quantityBadgeStyle = {
  background: '#bee3f8',
  color: '#2b6cb0',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600'
};

const medicineDetailsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  fontSize: '14px',
  color: '#4a5568'
};

const stockInfoStyle = {
  marginTop: '8px',
  padding: '8px',
  background: '#f7fafc',
  borderRadius: '4px'
};

const lowStockWarningStyle = {
  color: '#e53e3e',
  fontWeight: '600'
};

const checkInteractionsButtonStyle = {
  background: '#fed7d7',
  color: '#c53030',
  border: '1px solid #feb2b2',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500'
};

const textareaStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  fontFamily: 'inherit',
  resize: 'vertical'
};

const actionButtonsStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end'
};

const rejectButtonStyle = {
  background: '#fed7d7',
  color: '#c53030',
  border: '1px solid #feb2b2',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600'
};

const approveButtonStyle = {
  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600'
};

export default PrescriptionVerification;
