### Challenge

##### Detail how you would store several versioned, text-based documents, and present a schema for your solution.

It should be able to show:

- the document in its current state  
- the document at any point in its history  
- the changes made between two versions  

Strive for disk space efficiency.

### Solution

Document Schema:
```
{
    id: string,
    content: string,
    history: [
        {
            diff: Array
        }
    ]
}
```

Each history item holds a diff between the previous and next one. It's kept in an object in case we want to add additional metadata like timestamp, author, etc. 

Diff is made using a Lib like [text-diff](https://github.com/liddiard/text-diff), but any code that can extract the difference between 2 strings can work.

To get a previous revision you apply each diff in the array until the revision you want.



For optimizations, `history` can be moved to another collection so it's not requested each time the document is requested.

### Example

Proof of concept of versioning multiple documents is available.

Run `npm start`

Open in the browser: `http://127.0.0.1:3000/`