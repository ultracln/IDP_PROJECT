import { Configuration } from './api8082/runtime';

export const getApiConfig = () => {
    const token = localStorage.getItem('token');
    
    return new Configuration({
        basePath: 'http://localhost:8082',
        accessToken: token || '',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// Create API instances
export const createApi = <T>(ApiClass: new (config: Configuration) => T): T => {
    const config = getApiConfig();
    return new ApiClass(config);
}; 