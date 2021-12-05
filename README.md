# hays

hays finds, transforms and replaces keys with a specific name deeply nested inside an object.

## Install

`npm install hays`

## Usage

```javascript
const hays = require('hays')

const book = {
  isbn: '123-456-222',
  title: 'The Ultimate Database Study Guide',
  category: ['Non-Fiction', 'Technology'],
  author: {
    lastname: 'Windler',
    firstname: 'Dianne',
  },
  editor: {
    lastname: 'Smith',
    firstname: 'Felicity',
  },
}

console.log(hays.find(book, 'firstname'))
// [
//  { path: 'author.firstname', data: { value: 'Dianne' } },
//  { path: 'editor.firstname', data: { value: 'Felicity' } }
// ]

console.log(hays.find(book, 'title', { transform: s => s.toLowerCase() }))
// [
//   {
//     path: 'title',
//     data: {
//       value: 'The Ultimate Database Study Guide',
//       transformed: 'the ultimate database study guide',
//     },
//   }
// ]

console.log(hays.replace(book, 'category', c => c.concat('Educational')))
// [
//   {
//     path: 'category',
//     data: {
//       old: [ 'Non-Fiction', 'Technology' ],
//       new: [ 'Non-Fiction', 'Technology', 'Educational' ]
//     }
//   }
// ]

console.log(book)
// {
//   isbn: '123-456-222',
//   title: 'The Ultimate Database Study Guide',
//   category: ['Non-Fiction', 'Technology', 'Educational'],
//   author: { lastname: 'Windler', firstname: 'Dianne' },
//   editor: { lastname: 'Smith', firstname: 'Felicity' },
// }
```
