## Challenge

Detail how you would store several versioned, text-based documents, and present a schema for your solution.

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
            revision: number,
            diff: Array
        }
    ]
}
```

Each history item holds a diff between the previous and next one.  

Diff is made using a Lib like [text-diff](https://github.com/liddiard/text-diff) or similar.

Revision diffs are compacted by storing only the removed as string and the rest as length to reduce duplicate data.

To get a previous revision you apply each revision in the array until the revision you want.

Different computations are made on either client or server to split the CPU load. They can be moved on either side to adjust it.

Additional compression can be used for the chosen storage (file, database, memory)  

## Example

A prototype is available.

Install dependencies

```
npm install
``` 

Run the App
 
```
npm start
```

Open in the browser: [http://127.0.0.1:3000/](http://127.0.0.1:3000/)

### Possible Optimizations:
 - Documents can be split into chunks and ran in parallel threads to not block the operation of UI/UX and reduce computation time
 - Content can be fetched in chunks
 - `history` can be moved to another collection/API so it's not requested each time the document is requested 
 - `history` can be paginated through the API if a sizable amount is a standard average 
