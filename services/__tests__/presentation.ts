// Test go here
// To be clear, the tests should never call any APIs.
// The tests should call the functions the APIs would usually call.
// So if '/app/explode' would call issuer_explode(), you should call issuer_explode() in the tests.
import { addOne } from '../identity_holder/src/index';

describe('testing issuer addOne', () => {
    test('one plus one is two', () => {
        expect(addOne(1)).toBe(2);
    });
});