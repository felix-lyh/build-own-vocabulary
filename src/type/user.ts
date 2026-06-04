export interface UserInfoType {
    userId:string;
    name: string;
    email: string;
    pwt: string;
    createTime:number; // Date.now
}

export type LoginParamsType = Pick<UserInfoType, 'email' | 'pwt'>;

export type RegisterParamsType = Omit<UserInfoType, 'token'>;