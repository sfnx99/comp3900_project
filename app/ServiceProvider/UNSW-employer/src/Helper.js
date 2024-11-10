
const os = require('os');

function getLocalIPAddress() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    for (const net of networkInterfaces[interfaceName]) {
      // Check for IPv4 and skip internal (localhost) addresses
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`Local IP Address: ${net.address}`);
        return net.address;
      }
    }
  }
  console.log('No local IP address found.');
  return null;
}

getLocalIPAddress();

