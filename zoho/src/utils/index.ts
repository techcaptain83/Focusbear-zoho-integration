const dataCenterUrl = {
  au: {
    api: 'https://projectsapi.zoho.com.au/restapi',
    accounts: 'https://accounts.zoho.com.au',
  },
  eu: {
    api: 'https://projectsapi.zoho.eu/restapi',
    accounts: 'https://accounts.zoho.eu',
  },
  in: {
    api: 'https://projectsapi.zoho.in/restapi',
    accounts: 'https://accounts.zoho.in',
  },
  us: {
    api: 'https://projectsapi.zoho.com/restapi',
    accounts: 'https://accounts.zoho.com',
  },
  jp: {
    api: 'https://projectsapi.zoho.jp/restapi',
    accounts: 'https://accounts.zoho.jp',
  },
  uk: {
    api: 'https://projectsapi.zoho.co.uk/restapi',
    accounts: 'https://accounts.zoho.co.uk',
  },
};

export const getDataCenterUrl = (location) => {
  if (dataCenterUrl[location]) {
    return dataCenterUrl[location];
  } else {
    return {
      api: `https://projectsapi.zoho.com.${location}/restapi`,
      accounts: `https://accounts.zoho.co.${location}`,
    };
  }
};
