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

hays.find(book, 'firstname').then(console.log)
// [
//  { path: 'author.firstname', data: { value: 'Dianne' } },
//  { path: 'editor.firstname', data: { value: 'Felicity' } }
// ]

hays.find(book, /.*name/).then(console.log)
// [
//   { path: 'author.lastname', data: { value: 'Windler' } },
//   { path: 'author.firstname', data: { value: 'Dianne' } },
//   { path: 'editor.lastname', data: { value: 'Smith' } },
//   { path: 'editor.firstname', data: { value: 'Felicity' } }
// ]

hays.find(book, 'title', { transform: s => s.toLowerCase() }).then(console.log)
// [
//   {
//     path: 'title',
//     data: {
//       value: 'The Ultimate Database Study Guide',
//       transformed: 'the ultimate database study guide',
//     },
//   }
// ]

hays.replace(book, 'category', c => c.concat('Educational')).then(console.log)
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
