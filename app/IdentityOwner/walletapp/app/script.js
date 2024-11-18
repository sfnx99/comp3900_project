import config from './config.json';

export const getToken = async () => {
  const res = await fetch(`${config.wallet_url}/v2/get-code`, {
    method: 'POST'
  });

  

  const data = await res.json()

  console.log('INSIDE GETTOKEN')

  console.log(data)

  return data.token
}
