[![Github License](https://badgen.net/github/license/lamualfa/minion?color=purple&label=license)](https://github.com/lamualfa/minion/blob/master/LICENSE)
![CI](https://github.com/lamualfa/minion/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/lamualfa/minion/branch/master/graph/badge.svg?token=NZ6VHIHJJV)](https://codecov.io/gh/lamualfa/minion)
[![Maintainability](https://api.codeclimate.com/v1/badges/cd4f513ac8e1652b1b7c/maintainability)](https://codeclimate.com/github/lamualfa/minion/maintainability)

## What is Minion?

Minion is a tool used to change selectors in the Javascript code based on the [Class Maps](#class-maps) that passing in options.

### Example:

**Class Maps**

Whats is Class Maps? See [Class Maps](#class-maps).

```js
{
  'text-4xl': 'a',
  'font-medium': 'b',
  'absolute': 'c',
  'rounded': 'd'
}
```
> Example using Tailwind CSS Class

**Javascript Input**

```js
document.getElementById('title').classList.add('text-4xl', 'font-medium')
document.getElementById('modal').classList.add('rounded', 'absolute')
document.getElementById('banner').classList.add('rounded')
```

**After processing with Minion**
```js
document.getElementById('title').classList.add('a', 'b')
document.getElementById('modal').classList.add('d', 'c')
document.getElementById('banner').classList.add('d')
```

<hr>

## Installation

```bash
# NPM
npm i minion-js --save-dev

# Yarn
yarn add -D minion-js
```

<hr>

## Usage

```js
import createMinion from 'minion-js'

const minion = createMinion({
  // In real case, Class Maps will automatically generated by Extractors.
  getClassMaps: () => ({
    'bg-gray-100': 'a',
    'border-3': 'b',
    'mt-2': 'c',
  })
})

const originalCode = `
document.getElementById('box').classList.add(['bg-gray-100']);
document.getElementsByClassName('mt-2');
console.log('border-3')
`
const modifiedCode = minion(originalCode)

console.log(modifiedCode)
```

**Output**

```js
document.getElementById('box').classList.add(['a']);
document.getElementsByClassName('b');
console.log('c')
```

<hr>

## Features

### Ignore replacement

You can exclude some code from being modified by this package using inline-comment. The comment is `minion-disable` and `minion-enable`.

#### Example

**Class Maps**
```js
{
  'object-cover': 'a',
  relative: 'b'
}
```

**Input**
```js
// minion-disable
const someDescription = 'Gravity relative to the mass of the object.'
// minion-enable
const imageClass = 'relative object-cover rounded'
```
> See "relative" word after "Gravity" word

**Output**
```js
// minion-disable
const someDescription = 'Gravity relative to the mass of the object.'
// minion-enable
const imageClass = 'a b rounded'
```
> Nothing has changed from the `someDescription` variable

<hr>

### Concept

#### Class Maps

Object that contains the data set to replace. In real case, this object will automatically generated by [Extractors](#extractors).

##### Format
```js
{
  '<target>': '<substitute>'
}
```

##### Example

```js
{
  absolute: 'a',
  relative: 'b',
  block: 'c'
}
```

- `absolute` will be change to `a`.
- `relative` will be change to `b`.
- `block` will be change to `c`.


#### Extractors

Part that will generate the [Class Maps](#class-maps) from the existing CSS file.

##### Example

**CSS**

```css
.text-black {
  color: black;
}

.italic {
  font-style: italic;
}
```

**Will be converted to Class Maps by [Extractors](#extractors)**

```js
{
  'text-black': 'a',
  'italic': 'b'
}
```