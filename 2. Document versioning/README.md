## Challenge

##### Detail how you would store several versioned, text-based documents, and present a schema for your solution.

It should be able to show:

- the document in its current state  
- the document at any point in its history  
- the changes made between two versions  

Strive for disk space efficiency.

## Solution

Document Schema:
```
{
    id: string,
    name: string,
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

Revision diffs are compacted by storing only the removed as string and the rest as length to reduce duplicate data.

To get a previous revision you apply each diff in the array until the revision you want.

Computations are also made on the client machine to reduce computational load on servers

#### For optimizations:
 - Large documents can be split into chunks and ran in parallel to not block the operation of UI/UX and reduce computation time
 - `history` can be moved to another collection/API so it's not requested each time the document is requested 
 - `history` can be paginated through the API if a sizable amount is a standard average 

## Example

Proof of concept of versioning multiple documents is available.

Run `npm start`

Open in the browser: `http://127.0.0.1:3000/`