## Challenge

Implement a REST API using Express.js that handles Export and Import requests. The solution should ideally be written in Typescript, or else using plain JavaScript's `class` structure.

The API should expose endpoints to:
- `POST` a request for a **new Export job**. Valid requests should be saved in memory. Invalid requests should return an error. The request must have the following schema:

  ```javascript
  {
    bookId: string,
    type: "epub" | "pdf"
  }
  ```

- `GET` a list of **Export requests**, grouped by their current `state` (see below).
- `POST` a request for a new **Import job**. Valid requests should be saved in memory. Invalid requests should return an error. The request must have the following schema:

  ```javascript
  {
    bookId: string,
    type: "word" | "pdf" | "wattpad" | "evernote",
    url: string
  }
  ```

- `GET` a list of **Import requests**, grouped by their current `state` (see below).

Both export and import requests should be created with a `pending` state, and with a `created_at` timestamp. An import or export should take the amount of time outlined below. After the specified time, the state should be updated from `pending` to `finished` and update an `updated_at` timestamp.

| Job type     | Processing time (s) |
| ------------ | ------------------- |
| ePub export  | 10                  |
| PDF export   | 25                  |
| import (any) | 60                  |

Add test coverage as you see fit.

The project should be responsible for managing all the required dependencies and should run just by using `npm install` and `npm start`.

## Solution

### Install Dependencies

```
npm install
```

### Start

```
npm start
```

### Development

```
npm run dev
```

### Running tests

```
npm test
```
