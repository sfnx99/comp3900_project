import { HttpStatusCode } from "axios";
import { toUser } from "./data";
import { ResponseV2, User } from "./interface";

type Tail<T extends any[]> = T extends [User, ...infer Rest] ? Rest : never; // eslint-disable-line @typescript-eslint/no-explicit-any
type FunctionRequiringAuthorisation = (user: User, ...args: any[]) => ResponseV2 | Promise<ResponseV2> // eslint-disable-line @typescript-eslint/no-explicit-any
/**
 * This function wraps another function that requires authorisation, and handles all the server-side stuff.
 * 
 * Instead of calling `doThing(token, "Hello World")`, you can call `wrapAuthorisation(token, doThing, "Hello World")`.
 * 
 * This means that `doThing` does not need to authorise the User, or handle errors.
 */
export async function wrapAuthorisation<T extends FunctionRequiringAuthorisation>(
    token: string | undefined,
    func: T,
    ...func_args: Tail<Parameters<T>>
): Promise<ResponseV2> {
    // If you are looking further into this, note that the first argument of the function you
    // are passing in should be user. The token is automatically converted to a user in this code.
    // See additional comments.
    if (token === undefined) {
        return {
            status: HttpStatusCode.Unauthorized,
            body: {
                error: "User is not logged in"
            }
        }
    }
    const user = toUser(token);
    if (user === undefined) {
        return {
            status: 401,
            body: {
                error: "Invalid session"
            }
        };
    }
    try {
        // Here is where the function is called. Notice how the function requires the user field.
        // Also notice how the rest of the arguments for that function are passed in afterwards.
        // See getCredentialV2 for example usage - it has a User argument, and then the rest of its arguments.
       const res = await func(user, ...func_args);
       return res
    } catch (err) {
        return {
            status: 500,
            body: {
                error: err
            }
        }
    }
}