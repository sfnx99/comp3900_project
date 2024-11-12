import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ data }) => {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    // Convert JSON data to string format
    const jsonString = JSON.stringify(data);

    // Generate QR Code as SVG
    QRCode.toString(jsonString, { type: 'svg' }, (err, svg) => {
      if (err) {
        console.error("Error generating QR Code:", err);
      } else {
        setSvgContent(svg); // Set the generated SVG content
      }
    });
  }, [data]);

  return (
    <div>
      <h3>QR Code for JSON Data</h3>
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
};

export default QRCodeGenerator;