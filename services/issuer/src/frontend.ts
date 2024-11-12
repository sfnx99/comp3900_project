import { addUser, editUser, setFormats, addIssuerAdmin } from "./db.js";

export function registerUser(email: string, password: string) { // eslint-disable-line @typescript-eslint/no-unused-vars
    addUser(email, {});
}

export function registerIssuer(email: string, password: string) { // eslint-disable-line @typescript-eslint/no-unused-vars
    addIssuerAdmin(email, {});
}

export function modifyUser(email: string, info: {[key: string] : string}) {
    editUser(email, info);
}

export function modifyFormat(type: string, attributes: string[]) {
    setFormats([{id: type, fields: attributes}]);
}