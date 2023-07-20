const axios = require('axios');

async function getExchangeRate(code, date) {
  let parts = date.split('-');
  date = parts[2] + '/' + parts[1] + '/' + parts[0];  
  const url = `https://www.cbr.ru/scripts/XML_daily.asp?date_req=${date}`;
  
  try {
    const response = await axios.get(url);
    const xmlDoc = response.data;
    
    
    if (match) {
        const currencyNodes = xmlDoc.getElementsByTagName('Valute');
        for (let i = 0; i < currencyNodes.length; i++) {
          const currencyCode = currencyNodes[i].getElementsByTagName('CharCode')[0].textContent;
          if (currencyCode === code) {
            const currencyName = currencyNodes[i].getElementsByTagName('Name')[0].textContent;
            const currencyValue = currencyNodes[i].getElementsByTagName('Value')[0].textContent;
            console.log(`Exchange rate for ${currencyName} (${currencyCode}) on ${date}: ${currencyValue}`);
            return;
          }
        }
    } else {
      console.log(`Exchange rate not found for ${code} on ${date}`);
    }
  } catch (error) {
    console.error('Error occurred while fetching exchange rate:', error.message);
  }
}

function getCurrencyName(code) {
  const currencyNames = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
  };
  
  return currencyNames[code] || 'Unknown Currency';
}

const args = process.argv.slice(2);
const options = {};
args.forEach(arg => {
  const parts = arg.split('=');
  if (parts.length === 2) {
    options[parts[0].replace('--', '')] = parts[1];
  }
});

if (!options.code || !options.date) {
  console.error('Please provide both --code and --date options');
  process.exit(1);
}

getExchangeRate(options.code.toUpperCase(), options.date);