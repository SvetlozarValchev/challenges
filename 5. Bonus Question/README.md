## Challenge

When multiple users are collaborating on a document, collisions in their edits inevitably occur. Implement a module that can handle basic text update operations, and combine two colliding edits into a single operation.

An operation is described as an array of any combination of three types of edits:

- `{ move: number }` to advance the caret
- `{ insert: string }` to insert the string at caret
- `{ delete: number }` to delete a number of chars from the caret onwards

Implement the following methods:
- `Operation.prototype.combine(operation)` Updates the operation by combining it with another colliding operation
- `Operation.combine(op1, op2)` Static method that returns a new operation by combining the arguments without mutating them
- `Operation.prototype.apply(string)` Applies the operation to the provided argument

For example:

```javascript
const s = "abcdefg";
const op1 = new Operation([{ move: 1 }, { insert: "FOO" }]);
const op2 = new Operation([{ move: 3 }, { insert: "BAR" }]);

op1.apply(s); // => "aFOObcdefg"
op2.apply(s); // => "abcBARdefg"

const combined1 = Operation.combine(op1, op2); // => [{ move: 1 }, { insert: 'FOO' }, { move: 2}, { insert: 'BAR' } ]
combined1.apply(s); // => "aFOObcBARdefg"

const combined2 = Operation.combine(op2, op1);
expect(combined2.apply(s)).to.equal(combined1.apply(s));
```

Add test coverage to demonstrate the module functionality. Again, TypeScript is preferred in this solution.

The project should be responsible for managing all the required dependencies and should run just by using `npm install` and `npm test`.

## Solution

### Install Dependencies

```
npm install
```

### Running tests

```
npm test
```
