import { addUser, editUser, setFormats } from "./db.js";

export function registerUser(email: string, password: string) {
    addUser(email, {});
}

export function modifyUser(email: string, info: {[key: string] : string}) {
    editUser(email, info);
}

export function modifyFormat(type: string, attributes: string[]) {
    setFormats([{id: type, fields: attributes}]);
}