export interface User {
    _id?: string;
    username: string;
    password: string;
    role: 'admin' | 'editor' | 'viewer'
    
}