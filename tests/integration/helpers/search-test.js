import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { A as emberArray } from '@ember/array';
import { run } from '@ember/runloop';
import { findAll, find, fillIn } from 'ember-native-dom-helpers';

moduleForComponent('search', 'Integration | Helper | search', {
  integration: true
});

test('it returns the collection if the query is empty', function(assert) {
  this.set('collection', emberArray(['apples', 'bananas', 'oranges']));

  this.render(hbs`
    <ul>
    {{#each (search "" collection) as |result|}}
      <li>{{result}}</li>
    {{/each}}
    </ul>
  `);

  let results = findAll('ul li');

  assert.equal(results.length, 3);
  assert.equal(results[0].textContent.trim(), 'apples');
  assert.equal(results[1].textContent.trim(), 'bananas');
  assert.equal(results[2].textContent.trim(), 'oranges');
});

test('it can have zero results', function(assert) {
  this.set('collection', emberArray(['apples', 'bananas', 'oranges']));

  this.render(hbs`
    {{#unless (search "kirby" collection)}}
      <p>No results.</p>
    {{/unless}}
  `);

  assert.equal(find('p').textContent.trim(), 'No results.');
});

test('it renders a searched state', function(assert) {
  this.set('collection', emberArray(['apples', 'bananas', 'oranges']));

  this.render(hbs`
    <ul>
    {{#each (search "Apples" collection) as |result|}}
      <li>{{result}}</li>
    {{/each}}
    </ul>
  `);

  assert.equal(findAll('ul li').length, 1);
  assert.equal(find('ul li').textContent.trim(), 'apples');
});

test('the results can match partial queries', function(assert) {
  this.set('collection', emberArray(['apples', 'bananas', 'oranges']));

  this.render(hbs`
    <ul>
    {{#each (search "GES" collection) as |result|}}
      <li>{{result}}</li>
    {{/each}}
    </ul>
  `);

  assert.equal(findAll('ul li').length, 1);
  assert.equal(find('ul li').textContent.trim(), 'oranges');
});

test('the results can be forced to match the case of the query', function(assert) {
  this.set('collection', emberArray(['apples', 'bananas', 'oranges']));

  this.render(hbs`
    {{#unless (search "GES" collection caseSensitive=true)}}
      <p>No results.</p>
    {{/unless}}
  `);

  assert.equal(find('p').textContent.trim(), 'No results.');
});

test('the results change when the query changes', async function(assert) {
  this.set('collection', emberArray(['apples', 'bananas', 'oranges']));
  this.set('query', 'apples');

  this.render(hbs`
    {{input value=query on-key-press=(action (mut query))}}

    <ul>
      {{#each (search query collection) as |result|}}
        <li>{{result}}</li>
      {{/each}}
    </ul>
  `);

  assert.equal(findAll('ul li').length, 1);
  assert.equal(find('ul li').textContent.trim(), 'apples');

  await fillIn('input', 'bananas');

  assert.equal(findAll('ul li').length, 1);
  assert.equal(find('ul li').textContent.trim(), 'bananas');
});

test('the results can be forced to be an exact match of the query', function(assert) {
  this.set('collection', emberArray(['apples', 'bananas', 'oranges']));
  this.set('query', 'app');

  this.render(hbs`
    <ul>
      {{#each (search query collection exactMatch=true) as |result|}}
        <li>{{result}}</li>
      {{/each}}
    </ul>
  `);

  assert.equal(findAll('ul li').length, 0);

  run(() => {
    this.set('query', 'apples');
  });

  assert.equal(findAll('ul li').length, 1);
  assert.equal(find('ul li').textContent.trim(), 'apples');
});

test('properties can be an array of synchronous props', async function(assert) {
  this.set('collection', emberArray([
    {
      name: "apples",
      opinion: "okay"
    },
    {
      name: "bananas",
      opinion: "gross"
    },
    {
      name: "oranges",
      opinion: "awesome"
    }
  ]));
  this.set('properties', emberArray(['name', 'opinion']));

  this.set('query', 'apples');

  this.render(hbs`
    {{input value=query on-key-press=(action (mut query))}}

    <ul>
      {{#each (search query collection properties=properties) as |result|}}
        <li>{{result.name}} ({{result.opinion}})</li>
      {{/each}}
    </ul>
  `);

  assert.equal(findAll('ul li').length, 1);
  assert.equal(find('ul li').textContent.trim(), 'apples (okay)');

  await fillIn('input', 'awesome');

  assert.equal(findAll('ul li').length, 1);
  assert.equal(find('ul li').textContent.trim(), 'oranges (awesome)');
});

test('it updates the results if the collection is updated', function(assert) {
  this.set('collection', emberArray(['apples', 'bananas', 'oranges']));

  this.render(hbs`
    <ul>
    {{#each (search "" collection) as |result|}}
      <li>{{result}}</li>
    {{/each}}
    </ul>
  `);

  let results = findAll('ul li');

  assert.equal(results.length, 3);
  assert.equal(results[0].textContent.trim(), 'apples');
  assert.equal(results[1].textContent.trim(), 'bananas');
  assert.equal(results[2].textContent.trim(), 'oranges');

  run(() => {
    this.get('collection').pushObject('mangoes');
  });

  assert.equal(findAll('ul li').length, 4);
});
