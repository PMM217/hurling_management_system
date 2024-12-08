const config = {
    apiUrl: process.env.NODE_ENV === 'production'
        ? 'http://3.83.140.105:3000/api'  // Your EC2 public IP
        : 'http://localhost:3000/api'
};

export default config;