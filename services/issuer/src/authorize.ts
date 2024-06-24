
let tokens = new Set<string>();

export function authorize(email: string, password: string): { access_token: string } {
    const access_token = (Math.random() + 1).toString(36).substring(2);
    tokens.add(access_token);
    return { access_token };
}

export function use_token(access_token: string): boolean {
    return tokens.delete(access_token);
}

export function add_token(access_token: string) {
    tokens.add(access_token)
}