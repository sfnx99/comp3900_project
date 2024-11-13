const IPconfig = require('./config.json')
const IPaddress = IPconfig.IPaddress
export const getToken = async () => {
  const res = await fetch(`http://${IPaddress}:8081/v2/get-code`, {
    method: 'POST'
  });

  const data = await res.json()
  return data.token
}