import { use_token } from "./authorize";
import { SSICredential } from "./types";

export function issue(access_token: string): SSICredential {
    if (use_token(access_token)) {
        // Do Soemthing.
    };
    return { issuer: "Service NSW", credential: [{ first_name: "John" }, { last_name: "Smith" }, { dob: "1/1/2001" }] };
}