import { Configuration } from './api8082/runtime';

// Default to Kong's URL if environment variable is not set
const KONG_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8000';
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || `${KONG_BASE_URL}/api/v1/auth`;
const BOOK_API_URL = import.meta.env.VITE_BOOK_API_URL || `${KONG_BASE_URL}/book`;
const OFFER_API_URL = import.meta.env.VITE_OFFER_API_URL || `${KONG_BASE_URL}/offers`;

export const getApiConfig = (serviceType: 'auth' | 'book' | 'offer' = 'book') => {
    const token = localStorage.getItem('token');
    
    // Select the appropriate base URL based on the service type
    const getBasePath = () => {
        switch (serviceType) {
            case 'auth':
                return AUTH_API_URL;
            case 'book':
                return BOOK_API_URL;
            case 'offer':
                return OFFER_API_URL;
            default:
                return BOOK_API_URL;
        }
    };

    return new Configuration({
        basePath: getBasePath(),
        accessToken: token || '',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
    });
};

// Create API instances with service type
export const createApi = <T>(ApiClass: new (config: Configuration) => T, serviceType: 'auth' | 'book' | 'offer' = 'book'): T => {
    const config = getApiConfig(serviceType);
    return new ApiClass(config);
}; 