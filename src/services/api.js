import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    deleteAccount: () => api.delete('/auth/profile'),
};

// Admin APIs
export const adminAPI = {
    createExam: (data) => api.post('/admin/exam/create', data),
    addQuestions: (examId, data) => api.post(`/admin/exam/${examId}/questions`, data),
    getAllExams: () => api.get('/admin/exams'),
    getExamById: (examId) => api.get(`/admin/exam/${examId}`),
    updateExam: (examId, data) => api.put(`/admin/exam/${examId}`, data),
    deleteExam: (examId) => api.delete(`/admin/exam/${examId}`),
    getAllResults: () => api.get('/admin/results'),
    getExamResults: (examId) => api.get(`/admin/exam/${examId}/results`),
    deleteQuestion: (questionId) => api.delete(`/admin/question/${questionId}`),
};

// Student APIs
export const studentAPI = {
    getAvailableExams: () => api.get('/student/exams'),
    startExam: (examId) => api.get(`/student/exam/${examId}/start`),
    submitExam: (examId, data) => api.post(`/student/exam/${examId}/submit`, data),
    getMyResults: () => api.get('/student/results'),
    getResultById: (resultId) => api.get(`/student/result/${resultId}`),
    checkAttempt: (examId) => api.get(`/student/check-attempt/${examId}`),
};

export default api;
