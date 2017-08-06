# ember-search-helper

[![Build Status](https://travis-ci.org/gmurphey/ember-search-helper.svg?branch=master)](https://travis-ci.org/gmurphey/ember-search-helper) [![Greenkeeper badge](https://badges.greenkeeper.io/gmurphey/ember-search-helper.svg)](https://greenkeeper.io/)

Provides a helper to filter an array by a partial search string.

## Examples

The `search` helper can filter simple arrays:

```javascript
// controller.js

export default Ember.Controller.extend({
  fruits: ['Apple', 'Banana', 'Orange']
  query: 'Oran'
});
```

```hbs
{{input value=query on-key-press=(action (mut query))}}

<ul>
{{#each (search query fruits) as |fruit|}}
  <li>{{fruit}}</li>
{{/each}}
</ul>
```

And arrays of objects:

```javascript
// controller.js

export default Ember.Controller.extend({
  fruits: [
    {
      name: 'Apple',
      opinion: 'Meh'
    },
    {
      name: 'Orange',
      opinion: 'Yay'
    },
    {
      name: 'Banana',
      opinion: 'Nay'
    }
  ],
  searchProperties: ['name', 'opinion'],
  query: 'ay'
});
```

```hbs
{{input value=query on-key-press=(action (mut query))}}

<ul>
{{#each (search query fruits properties=searchProperties) as |fruit|}}
  <li>{{fruit.name}}</li>
{{/each}}
</ul>
```

### Options

- `properties` (`Array`, default: `[]`)
  An array of properties you would like to search by. Only useful if you are searching an array of objects.

- `caseSenstive` (`Boolean`, default: `false`)
  When set to true, the `search` helper will only return results where the case of the query matches.

- `exactMatch` (`Boolean`, default: `true`)
  When set to true, the `search` helper will only return results where the query matches the string exactly.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-search-helper`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
