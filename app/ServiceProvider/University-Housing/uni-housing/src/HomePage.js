import React from 'react';
import { Link } from 'react-router-dom';

const housingOptions = [
  {
    title: 'Sydney Kensington by The Switch',
    imagePath: '/assets/switch.jpg',
    description: 'Find yourself at home within the bustling city and serene nature at The Switch Kensington.',
  },
  {
    title: 'Unilodge UNSW',
    imagePath: '/assets/unilodge.jpg',
    description: 'UniLodge Kensington is a brand new purpose built student accommodation property in Sydney, opening in October, 2024.',
  },
  {
    title: 'Scape Kingsford',
    imagePath: '/assets/scape.jpg',
    description: 'Scape Kingsford is Sydney\'s brand new student housing building, featuring quality studio and shared accommodation in a supportive community.',
  },
];

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '16px' }}>
      <h1>University Housing Options</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {housingOptions.map((option, index) => (
          <div key={index} style={{ marginBottom: '16px', border: '1px solid #ccc', width: '300px' }}>
            <img src={option.imagePath} alt={option.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <h2>{option.title}</h2>
            <p>{option.description}</p>
            <Link to="/apply">
              <button style={{ padding: '8px 16px', marginTop: '8px' }}>Apply</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
