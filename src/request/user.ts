import request from './index';

export interface AuthUser {
    userId: string;
    name: string;
    email: string;
    createTime: number;
}

export interface AuthResponse {
    payload: AuthUser & { token: string };
    message?: string;
}

/** Register a new account. Resolves with the user profile and JWT. */
export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
    return request({
        url: '/api/auth/register',
        method: 'post',
        data: { name, email, pwt: password },
    });
}

/** Log in with email and password. Resolves with the user profile and JWT. */
export async function login(email: string, password: string): Promise<AuthResponse> {
    return request({
        url: '/api/auth/login',
        method: 'post',
        data: { email, pwt: password },
    });
}

/** Fetch the profile of the currently authenticated user (uses the stored JWT). */
export async function getProfile(): Promise<{ payload: AuthUser }> {
    return request({
        url: '/api/user',
        method: 'get',
    });
}
