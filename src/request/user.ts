import request from './index';
export interface User {
    id: string;
    name: string;
    email: string;
}

/** Fetch a user by ID. */
export async function getUser(userId: string): Promise<User> {
    return request({
        url: `/api/users/${encodeURIComponent(userId)}`,
        method: 'get',
    });
}

/** Log a user in. */
export async function login(email: string, password: string): Promise<User> {
    return request({
        url: '/api/login',
        method: 'post',
        data: { email, password },
    });
}
