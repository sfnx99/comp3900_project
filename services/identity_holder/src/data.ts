import { Data } from './interface'

let data: Data = {
    users: [

    ],
    issuers: [
        "localhost:8082" // hardcoded
    ]
}

export function setData(newData: Data) {
    data = newData
}

export function getData() : Data {
    return data
}

// config
export const SALT_ROUNDS = 10