export interface UserRequest {
    id?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    email: string;
    password: string;
    access_token?: string;
    refresh_token?: string;

}
export interface UserResponse {
    access_token: string;
    refresh_token: string;

}

export interface UserRegister {
    code: number;
    message: string;
}