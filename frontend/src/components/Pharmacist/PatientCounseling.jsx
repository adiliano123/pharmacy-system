import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const PatientCounseling = () => {
  const { user } = useAuth();
  const [counselingRecords, setCounselingRecords] = useState([]);
  const [showNewCounselingForm, setShowNewCounselingForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    prescription_id: '',
    topics_covered: '',
    patient_understanding: 'good',
    follow_up_needed: false,
    follow_up_date: '',
    notes: ''
  });

  useEffect(() => {
    fetchCounselingRecords();
  }, []);

  const fetchCounselingRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/modules/patient_counseling.php');
      const data = await response.json();
      if (data.success) {
        setCounselingRecords(data.data);
      }
    } catch (error) {
      console.error('Error fetching counseling records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First create/get patient
      const patientResponse = await fetch('/api/modules/prescriptions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_patient',
          patient: {
            name: formData.patient_name,
            phone: formData.patient_phone,
            created_by: user.user_id
          }
        })
      });

      let patientId;
      if (patientResponse.ok) {
        const patientData = await patientResponse.json();
        patientId = patientData.patient_id;
      }

      // Create counseling record
      const counselingData = {
        patient_id: patientId,
        prescription_id: formData.prescription_id || null,
        counseled_by: user.user_id,
        topics_covered: formData.topics_covered,
        patient_understanding: formData.patient_understanding,
        follow_up_needed: formData.follow_up_needed,
        follow_up_date: formData.follow_up_date || null,
        notes: formData.notes
      };

      const response = await fetch('/api/modules/patient_counseling.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(counselingData)
      });

      const data = await response.json();
      if (data.success) {
        alert('Counseling record created successfully!');
        setShowNewCounselingForm(false);
        setFormData({
          patient_name: '',
          patient_phone: '',
          prescription_id: '',
          topics_covered: '',
          patient_understanding: 'good',
          follow_up_needed: false,
          follow_up_date: '',
          notes: ''
        });
        fetchCounselingRecords();
      }
    } catch (error) {
      console.error('Error creating counseling record:', error);
      alert('Error creating counseling record');
    }
  };

  const getUnderstandingColor = (level) => {
    switch (level) {
      case 'excellent': return '#48bb78';
      case 'good': return '#38a169';
      case 'fair': return '#ed8936';
      case 'poor': return '#e53e3e';
      default: return '#718096';
    }
  };

  const counselingTopics = [
    'Medication dosage and timing',
    'Side effects and warnings',
    'Drug interactions',
    'Storage instructions',
    'Missed dose instructions',
    'Duration of treatment',
    'Lifestyle modifications',
    'Follow-up requirements'
  ];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>👥 Patient Counseling</h2>
        <button
          onClick={() => setShowNewCounselingForm(true)}
          style={addButtonStyle}
        >
          ➕ New Counseling Session
        </button>
      </div>

      {/* New Counseling Form Modal */}
      {showNewCounselingForm && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>New Patient Counseling Session</h3>
              <button
                onClick={() => setShowNewCounselingForm(false)}
                style={closeButtonStyle}
              >
                ❌
              </button>
            </div>

            <form onSubmit={handleSubmit} style={formStyle}>
              <div style={formGridStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Patient Name *</label>
                  <input
                    type="text"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Patient Phone</label>
                  <input
                    type="tel"
                    value={formData.patient_phone}
                    onChange={(e) => setFormData({...formData, patient_phone: e.target.value})}
                    style={inputStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Prescription ID (if applicable)</label>
                  <input
                    type="text"
                    value={formData.prescription_id}
                    onChange={(e) => setFormData({...formData, prescription_id: e.target.value})}
                    style={inputStyle}
                    placeholder="e.g., RX-2024-001"
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Patient Understanding</label>
                  <select
                    value={formData.patient_understanding}
                    onChange={(e) => setFormData({...formData, patient_understanding: e.target.value})}
                    style={selectStyle}
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Topics Covered *</label>
                <div style={topicsGridStyle}>
                  {counselingTopics.map((topic, index) => (
                    <label key={index} style={checkboxLabelStyle}>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const topics = formData.topics_covered.split(', ').filter(t => t);
                          if (e.target.checked) {
                            topics.push(topic);
                          } else {
                            const topicIndex = topics.indexOf(topic);
                            if (topicIndex > -1) topics.splice(topicIndex, 1);
                          }
                          setFormData({...formData, topics_covered: topics.join(', ')});
                        }}
                        style={checkboxStyle}
                      />
                      <span style={checkboxTextStyle}>{topic}</span>
                    </label>
                  ))}
                </div>
                <textarea
                  value={formData.topics_covered}
                  onChange={(e) => setFormData({...formData, topics_covered: e.target.value})}
                  placeholder="Additional topics or details..."
                  style={textareaStyle}
                  rows={3}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={formData.follow_up_needed}
                    onChange={(e) => setFormData({...formData, follow_up_needed: e.target.checked})}
                    style={checkboxStyle}
                  />
                  <span style={checkboxTextStyle}>Follow-up needed</span>
                </label>
                
                {formData.follow_up_needed && (
                  <input
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})}
                    style={inputStyle}
                    min={new Date().toISOString().split('T')[0]}
                  />
                )}
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional observations, concerns, or recommendations..."
                  style={textareaStyle}
                  rows={4}
                />
              </div>

              <div style={formActionsStyle}>
                <button
                  type="button"
                  onClick={() => setShowNewCounselingForm(false)}
                  style={cancelButtonStyle}
                >
                  Cancel
                </button>
                <button type="submit" style={submitButtonStyle}>
                  Save Counseling Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Counseling Records List */}
      <div style={recordsContainerStyle}>
        <h3 style={sectionTitleStyle}>Recent Counseling Sessions</h3>
        
        {loading ? (
          <div style={loadingStyle}>Loading counseling records...</div>
        ) : counselingRecords.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <p>No counseling records found</p>
            <p style={{ fontSize: '14px', color: '#718096' }}>
              Start by creating a new counseling session
            </p>
          </div>
        ) : (
          <div style={recordsListStyle}>
            {counselingRecords.map((record, index) => (
              <div key={index} style={recordCardStyle}>
                <div style={recordHeaderStyle}>
                  <div>
                    <div style={patientNameStyle}>{record.patient_name}</div>
                    <div style={counselorStyle}>
                      Counseled by: {record.counseled_by_name}
                    </div>
                  </div>
                  <div style={recordMetaStyle}>
                    <div style={dateStyle}>
                      {new Date(record.counseling_date).toLocaleDateString()}
                    </div>
                    <div
                      style={{
                        ...understandingBadgeStyle,
                        backgroundColor: getUnderstandingColor(record.patient_understanding)
                      }}
                    >
                      {record.patient_understanding.toUpperCase()}
                    </div>
                  </div>
                </div>

                {record.prescription_number && (
                  <div style={prescriptionInfoStyle}>
                    📋 Prescription: {record.prescription_number}
                  </div>
                )}

                <div style={topicsCoveredStyle}>
                  <strong>Topics Covered:</strong>
                  <div style={topicsListStyle}>
                    {record.topics_covered.split(', ').map((topic, i) => (
                      <span key={i} style={topicTagStyle}>{topic}</span>
                    ))}
                  </div>
                </div>

                {record.follow_up_needed && (
                  <div style={followUpStyle}>
                    📅 Follow-up needed: {record.follow_up_date ? 
                      new Date(record.follow_up_date).toLocaleDateString() : 
                      'Date TBD'
                    }
                  </div>
                )}

                {record.notes && (
                  <div style={notesStyle}>
                    <strong>Notes:</strong> {record.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalStyle = {
  background: '#fff',
  borderRadius: '12px',
  padding: '24px',
  maxWidth: '800px',
  width: '90%',
  maxHeight: '90vh',
  overflow: 'auto'
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px'
};

const modalTitleStyle = {
  margin: 0,
  color: '#2d3748',
  fontSize: '1.2rem'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle = {
  fontWeight: '600',
  color: '#2d3748',
  fontSize: '14px'
};

const inputStyle = {
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '14px'
};

const selectStyle = {
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  background: '#fff'
};

const textareaStyle = {
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  fontFamily: 'inherit',
  resize: 'vertical'
};

const topicsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '8px',
  marginBottom: '12px'
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer'
};

const checkboxStyle = {
  margin: 0
};

const checkboxTextStyle = {
  fontSize: '14px',
  color: '#4a5568'
};

const formActionsStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end'
};

const cancelButtonStyle = {
  background: '#e2e8f0',
  color: '#4a5568',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500'
};

const submitButtonStyle = {
  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600'
};

const recordsContainerStyle = {
  background: '#f7fafc',
  borderRadius: '12px',
  padding: '20px',
  height: 'calc(100vh - 400px)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const sectionTitleStyle = {
  margin: '0 0 16px 0',
  color: '#2d3748',
  fontSize: '1.1rem'
};

const recordsListStyle = {
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const recordCardStyle = {
  background: '#fff',
  borderRadius: '8px',
  padding: '20px',
  border: '1px solid #e2e8f0'
};

const recordHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '16px'
};

const patientNameStyle = {
  fontWeight: '600',
  color: '#2d3748',
  fontSize: '16px',
  marginBottom: '4px'
};

const counselorStyle = {
  color: '#718096',
  fontSize: '14px'
};

const recordMetaStyle = {
  textAlign: 'right'
};

const dateStyle = {
  color: '#4a5568',
  fontSize: '14px',
  marginBottom: '8px'
};

const understandingBadgeStyle = {
  color: '#fff',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '10px',
  fontWeight: '600'
};

const prescriptionInfoStyle = {
  background: '#e6fffa',
  color: '#234e52',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '14px',
  marginBottom: '12px'
};

const topicsCoveredStyle = {
  marginBottom: '12px'
};

const topicsListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '8px'
};

const topicTagStyle = {
  background: '#bee3f8',
  color: '#2b6cb0',
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '500'
};

const followUpStyle = {
  background: '#feebc8',
  color: '#c05621',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '14px',
  marginBottom: '12px'
};

const notesStyle = {
  background: '#f7fafc',
  padding: '12px',
  borderRadius: '6px',
  fontSize: '14px',
  color: '#4a5568'
};

const loadingStyle = {
  textAlign: 'center',
  padding: '40px',
  color: '#718096'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '60px 20px',
  color: '#718096'
};

export default PatientCounseling;