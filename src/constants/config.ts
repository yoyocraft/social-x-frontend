export const API_CONFIG = {
  AI_SUMMARY: {
    DEV: 'http://127.0.0.1:8085/api/ugc/summary',
    PROD: '/api/ugc/summary',
  },
};

export const getApiEndpoint = (key: keyof typeof API_CONFIG) => {
  const isProd = process.env.NODE_ENV === 'production';
  return isProd ? API_CONFIG[key].PROD : API_CONFIG[key].DEV;
};
