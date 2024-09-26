import React, { useState } from 'react';
import './App.css';

const initialSchemas = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Account Name', value: 'account_name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' },
];

function App() {
  const [showModal, setShowModal] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');
  const [availableSchemas, setAvailableSchemas] = useState(initialSchemas);

  const handleAddSchema = () => {
    if (selectedSchema) {
      const selected = availableSchemas.find(schema => schema.value === selectedSchema);
      setSchemas([...schemas, selected]);
      setAvailableSchemas(availableSchemas.filter(schema => schema.value !== selectedSchema));
      setSelectedSchema('');
    }
  };

  const handleSaveSegment = async () => {
    const payload = {
      segment_name: segmentName,
      schema: schemas.map(schema => ({ [schema.value]: schema.label }))
    };

    // Send data to webhook
    try {
      const response = await fetch('https://webhook.site/your-webhook-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Segment saved successfully!');
      } else {
        alert('Failed to save segment.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <button onClick={() => setShowModal(true)}>Save segment</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Saving Segment</h2>
            <label>Enter the Name of the Segment</label>
            <input
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
            <div className="schema-container">
              <label>Add schema to segment</label>
              <select
                value={selectedSchema}
                onChange={(e) => setSelectedSchema(e.target.value)}
              >
                <option value="">Select Schema</option>
                {availableSchemas.map((schema) => (
                  <option key={schema.value} value={schema.value}>
                    {schema.label}
                  </option>
                ))}
              </select>
              <button onClick={handleAddSchema}>+Add new schema</button>
              <div className="selected-schemas">
                {schemas.map((schema, index) => (
                  <div key={index} className="schema-item">
                    {schema.label}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleSaveSegment}>Save the Segment</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
