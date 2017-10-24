import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { get, set } from '@ember/object';
import { A as emberArray } from '@ember/array';
import { run } from '@ember/runloop';
import { findAll, find, fillIn } from 'ember-native-dom-helpers';

module('search', function(hooks) {
  setupRenderingTest(hooks);

  test('it returns the collection if the query is empty', async function(assert) {
    set(this, 'collection', emberArray(['apples', 'bananas', 'oranges']));

    await render(hbs`
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

  test('it can have zero results', async function(assert) {
    set(this, 'collection', emberArray(['apples', 'bananas', 'oranges']));

    await render(hbs`
      {{#unless (search "kirby" collection)}}
        <p>No results.</p>
      {{/unless}}
    `);

    assert.equal(find('p').textContent.trim(), 'No results.');
  });

  test('it renders a searched state', async function(assert) {
    set(this, 'collection', emberArray(['apples', 'bananas', 'oranges']));

    await render(hbs`
      <ul>
      {{#each (search "Apples" collection) as |result|}}
        <li>{{result}}</li>
      {{/each}}
      </ul>
    `);

    assert.equal(findAll('ul li').length, 1);
    assert.equal(find('ul li').textContent.trim(), 'apples');
  });

  test('the results can match partial queries', async function(assert) {
    set(this, 'collection', emberArray(['apples', 'bananas', 'oranges']));

    await this.render(hbs`
      <ul>
      {{#each (search "GES" collection) as |result|}}
        <li>{{result}}</li>
      {{/each}}
      </ul>
    `);

    assert.equal(findAll('ul li').length, 1);
    assert.equal(find('ul li').textContent.trim(), 'oranges');
  });

  test('the results can be forced to match the case of the query', async function(assert) {
    set(this, 'collection', emberArray(['apples', 'bananas', 'oranges']));

    await this.render(hbs`
      {{#unless (search "GES" collection caseSensitive=true)}}
        <p>No results.</p>
      {{/unless}}
    `);

    assert.equal(find('p').textContent.trim(), 'No results.');
  });

  test('the results change when the query changes', async function(assert) {
    set(this, 'collection', emberArray(['apples', 'bananas', 'oranges']));
    set(this, 'query', 'apples');

    await render(hbs`
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

  test('the results can be forced to be an exact match of the query', async function(assert) {
    set(this, 'collection', emberArray(['apples', 'bananas', 'oranges']));
    set(this, 'query', 'app');

    await render(hbs`
      <ul>
        {{#each (search query collection exactMatch=true) as |result|}}
          <li>{{result}}</li>
        {{/each}}
      </ul>
    `);

    assert.equal(findAll('ul li').length, 0);

    run(() => {
      set(this, 'query', 'apples');
    });

    assert.equal(findAll('ul li').length, 1);
    assert.equal(find('ul li').textContent.trim(), 'apples');
  });

  test('properties can be an array of synchronous props', async function(assert) {
    set(this, 'collection', emberArray([
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
    set(this, 'properties', emberArray(['name', 'opinion']));

    set(this, 'query', 'apples');

    await render(hbs`
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

  test('it updates the results if the collection is updated', async function(assert) {
    set(this, 'collection', emberArray(['apples', 'bananas', 'oranges']));

    await render(hbs`
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
      get(this, 'collection').pushObject('mangoes');
    });

    assert.equal(findAll('ul li').length, 4);
  });
});