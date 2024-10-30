import { addUser, editUser, setFormats } from "./db.js";

export function registerUser(email: string, password: string) { // eslint-disable-line @typescript-eslint/no-unused-vars
    addUser(email, {});
}

export function modifyUser(email: string, info: {[key: string] : string}) {
    editUser(email, info);
}

export function modifyFormat(type: string, attributes: string[]) {
    setFormats([{id: type, fields: attributes}]);
}