import { IssuerMetadata } from "./types";

export function metadata(): IssuerMetadata {
    return {
        issuer_id: "Service NSW",
        formats_supported: ["Learner Driver Licence", "Provisional Driver Licence", "Driver Licence", "Photo Card"],
    }
}