const config = {
    apiUrl: process.env.NODE_ENV === 'production'
    ? 'http://107.23.240.190:3000/api'// ? 'http://3.83.140.105:3000/api'  // EC2 public IP
        : 'http://localhost:3000/api'
};

export default config;