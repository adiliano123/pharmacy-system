'use client';

import { useState, useEffect } from 'react';

const DrugInteractionChecker = () => {
  const [selectedDrugs, setSelectedDrugs] = useState(['']);
  const [interactions, setInteractions] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allInteractions, setAllInteractions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllInteractions();
  }, []);

  const fetchAllInteractions = async () => {
    try {
      const response = await fetch('/api/modules/drug_interactions.php?action=all');
      const data = await response.json();
      if (data.success) {
        setAllInteractions(data.data);
      }
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

  const addDrugField = () => {
    setSelectedDrugs([...selectedDrugs, '']);
  };

  const removeDrugField = (index) => {
    const newDrugs = selectedDrugs.filter((_, i) => i !== index);
    setSelectedDrugs(newDrugs);
  };

  const updateDrug = (index, value) => {
    const newDrugs = [...selectedDrugs];
    newDrugs[index] = value;
    setSelectedDrugs(newDrugs);
  };

  const checkInteractions = async () => {
    const validDrugs = selectedDrugs.filter(drug => drug.trim() !== '');
    
    if (validDrugs.length < 2) {
      alert('Please enter at least 2 drugs to check for interactions');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/modules/drug_interactions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_multiple',
          drugs: validDrugs
        })
      });

      const data = await response.json();
      if (data.success) {
        setInteractions(data.interactions);
        setWarnings(data.warnings);
      }
    } catch (error) {
      console.error('Error checking interactions:', error);
      alert('Error checking drug interactions');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setSelectedDrugs(['']);
    setInteractions([]);
    setWarnings([]);
  };

  const getInteractionColor = (type) => {
    switch (type) {
      case 'major': return '#e53e3e';
      case 'moderate': return '#ed8936';
      case 'minor': return '#38a169';
      default: return '#718096';
    }
  };

  const getWarningStyle = (level) => {
    switch (level) {
      case 'error':
        return { background: '#fed7d7', color: '#c53030', border: '1px solid #feb2b2' };
      case 'warning':
        return { background: '#feebc8', color: '#c05621', border: '1px solid #fbd38d' };
      case 'info':
        return { background: '#e6fffa', color: '#234e52', border: '1px solid #81e6d9' };
      default:
        return { background: '#f7fafc', color: '#4a5568', border: '1px solid #e2e8f0' };
    }
  };

  const filteredInteractions = allInteractions.filter(interaction =>
    interaction.drug1_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interaction.drug2_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>⚠️ Drug Interaction Checker</h2>
        <p style={subtitleStyle}>
          Check for potential drug interactions to ensure patient safety
        </p>
      </div>

      <div style={contentGridStyle}>
        {/* Drug Input Section */}
        <div style={inputSectionStyle}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>Enter Medications</h3>
            <div style={buttonGroupStyle}>
              <button onClick={addDrugField} style={addButtonStyle}>
                ➕ Add Drug
              </button>
              <button onClick={clearAll} style={clearButtonStyle}>
                🗑️ Clear All
              </button>
            </div>
          </div>

          <div style={drugInputsStyle}>
            {selectedDrugs.map((drug, index) => (
              <div key={index} style={drugInputRowStyle}>
                <input
                  type="text"
                  value={drug}
                  onChange={(e) => updateDrug(index, e.target.value)}
                  placeholder={`Drug ${index + 1} (e.g., Warfarin, Aspirin)`}
                  style={drugInputStyle}
                />
                {selectedDrugs.length > 1 && (
                  <button
                    onClick={() => removeDrugField(index)}
                    style={removeButtonStyle}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={checkInteractions}
            disabled={loading || selectedDrugs.filter(d => d.trim()).length < 2}
            style={{
              ...checkButtonStyle,
              ...(loading ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loading ? '🔄 Checking...' : '🔍 Check Interactions'}
          </button>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div style={warningsContainerStyle}>
              <h4 style={warningsHeaderStyle}>⚠️ Interaction Warnings</h4>
              {warnings.map((warning, index) => (
                <div
                  key={index}
                  style={{
                    ...warningItemStyle,
                    ...getWarningStyle(warning.level)
                  }}
                >
                  {warning.message}
                </div>
              ))}
            </div>
          )}

          {/* Interaction Results */}
          {interactions.length > 0 && (
            <div style={resultsContainerStyle}>
              <h4 style={resultsHeaderStyle}>🔍 Detailed Interactions</h4>
              {interactions.map((interaction, index) => (
                <div key={index} style={interactionCardStyle}>
                  <div style={interactionHeaderStyle}>
                    <div style={drugPairStyle}>
                      <span style={drugNameStyle}>{interaction.drug1}</span>
                      <span style={vsStyle}>×</span>
                      <span style={drugNameStyle}>{interaction.drug2}</span>
                    </div>
                    <div
                      style={{
                        ...severityBadgeStyle,
                        backgroundColor: getInteractionColor(interaction.interaction_type),
                      }}
                    >
                      {interaction.interaction_type.toUpperCase()}
                    </div>
                  </div>
                  <div style={interactionDescriptionStyle}>
                    <strong>Description:</strong> {interaction.description}
                  </div>
                  {interaction.recommendation && (
                    <div style={recommendationStyle}>
                      <strong>Recommendation:</strong> {interaction.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Known Interactions Database */}
        <div style={databaseSectionStyle}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>Known Interactions Database</h3>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search interactions..."
              style={searchInputStyle}
            />
          </div>

          <div style={interactionsDatabaseStyle}>
            {filteredInteractions.length === 0 ? (
              <div style={emptyStateStyle}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <p>No interactions found</p>
              </div>
            ) : (
              filteredInteractions.map((interaction, index) => (
                <div key={index} style={databaseItemStyle}>
                  <div style={databaseItemHeaderStyle}>
                    <div style={drugPairStyle}>
                      <span style={drugNameStyle}>{interaction.drug1_name}</span>
                      <span style={vsStyle}>×</span>
                      <span style={drugNameStyle}>{interaction.drug2_name}</span>
                    </div>
                    <div
                      style={{
                        ...severityBadgeStyle,
                        backgroundColor: getInteractionColor(interaction.interaction_type),
                      }}
                    >
                      {interaction.interaction_type.toUpperCase()}
                    </div>
                  </div>
                  <div style={databaseItemDescriptionStyle}>
                    {interaction.description}
                  </div>
                  {interaction.recommendation && (
                    <div style={databaseItemRecommendationStyle}>
                      <strong>Recommendation:</strong> {interaction.recommendation}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
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
  marginBottom: '24px'
};

const titleStyle = {
  margin: '0 0 8px 0',
  color: '#2d3748',
  fontSize: '1.5rem'
};

const subtitleStyle = {
  margin: 0,
  color: '#718096',
  fontSize: '14px'
};

const contentGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
  height: 'calc(100vh - 350px)'
};

const inputSectionStyle = {
  background: '#f7fafc',
  borderRadius: '12px',
  padding: '20px',
  overflow: 'auto'
};

const databaseSectionStyle = {
  background: '#f7fafc',
  borderRadius: '12px',
  padding: '20px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px'
};

const sectionTitleStyle = {
  margin: 0,
  color: '#2d3748',
  fontSize: '1.1rem'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '8px'
};

const addButtonStyle = {
  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '500'
};

const clearButtonStyle = {
  background: '#e2e8f0',
  color: '#4a5568',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '500'
};

const drugInputsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '20px'
};

const drugInputRowStyle = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
};

const drugInputStyle = {
  flex: 1,
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '14px'
};

const removeButtonStyle = {
  background: '#fed7d7',
  color: '#c53030',
  border: 'none',
  padding: '8px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

const checkButtonStyle = {
  background: 'linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%)',
  color: '#fff',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  marginBottom: '20px'
};

const warningsContainerStyle = {
  marginBottom: '20px'
};

const warningsHeaderStyle = {
  margin: '0 0 12px 0',
  color: '#c53030',
  fontSize: '14px',
  fontWeight: '600'
};

const warningItemStyle = {
  padding: '12px',
  borderRadius: '6px',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: '500'
};

const resultsContainerStyle = {
  marginBottom: '20px'
};

const resultsHeaderStyle = {
  margin: '0 0 12px 0',
  color: '#2d3748',
  fontSize: '14px',
  fontWeight: '600'
};

const interactionCardStyle = {
  background: '#fff',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '12px',
  border: '1px solid #e2e8f0'
};

const interactionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px'
};

const drugPairStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const drugNameStyle = {
  fontWeight: '600',
  color: '#2d3748',
  background: '#e2e8f0',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px'
};

const vsStyle = {
  color: '#718096',
  fontWeight: '600'
};

const severityBadgeStyle = {
  color: '#fff',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '10px',
  fontWeight: '600'
};

const interactionDescriptionStyle = {
  fontSize: '14px',
  color: '#4a5568',
  marginBottom: '8px'
};

const recommendationStyle = {
  fontSize: '14px',
  color: '#2d3748',
  background: '#f7fafc',
  padding: '8px',
  borderRadius: '4px'
};

const searchInputStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  width: '200px'
};

const interactionsDatabaseStyle = {
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const databaseItemStyle = {
  background: '#fff',
  borderRadius: '6px',
  padding: '12px',
  border: '1px solid #e2e8f0'
};

const databaseItemHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
};

const databaseItemDescriptionStyle = {
  fontSize: '13px',
  color: '#4a5568',
  marginBottom: '6px'
};

const databaseItemRecommendationStyle = {
  fontSize: '12px',
  color: '#2d3748',
  background: '#f7fafc',
  padding: '6px',
  borderRadius: '3px'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '40px',
  color: '#718096'
};

export default DrugInteractionChecker;
