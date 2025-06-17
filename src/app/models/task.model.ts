export interface Task {
    _id: string;
    description: string;
    deadline: Date;
    completed: boolean;
    priority: 'low' | 'medium' | 'high'
    
}

