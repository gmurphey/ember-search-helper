import { findAll, fillIn } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';

import hbs from 'htmlbars-inline-precompile';
import { get, set } from '@ember/object';
import { A as emberArray } from '@ember/array';
import { run } from '@ember/runloop';

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
    assert.dom(results[0]).hasText('apples');
    assert.dom(results[1]).hasText('bananas');
    assert.dom(results[2]).hasText('oranges');
  });

  test('it can have zero results', async function(assert) {
    set(this, 'collection', emberArray(['apples', 'bananas', 'oranges']));

    await render(hbs`
      {{#unless (search "kirby" collection)}}
        <p>No results.</p>
      {{/unless}}
    `);

    assert.dom('p').hasText('No results.');
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

    assert.dom('ul li').exists({ count: 1 });
    assert.dom('ul li').hasText('apples');
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

    assert.dom('ul li').exists({ count: 1 });
    assert.dom('ul li').hasText('oranges');
  });

  test('the results can be forced to match the case of the query', async function(assert) {
    set(this, 'collection', emberArray(['apples', 'bananas', 'oranges']));

    await this.render(hbs`
      {{#unless (search "GES" collection caseSensitive=true)}}
        <p>No results.</p>
      {{/unless}}
    `);

    assert.dom('p').hasText('No results.');
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

    assert.dom('ul li').exists({ count: 1 });
    assert.dom('ul li').hasText('apples');

    await fillIn('input', 'bananas');

    assert.dom('ul li').exists({ count: 1 });
    assert.dom('ul li').hasText('bananas');
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

    assert.dom('ul li').doesNotExist();

    run(() => {
      set(this, 'query', 'apples');
    });

    assert.dom('ul li').exists({ count: 1 });
    assert.dom('ul li').hasText('apples');
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

    assert.dom('ul li').exists({ count: 1 });
    assert.dom('ul li').hasText('apples (okay)');

    await fillIn('input', 'awesome');

    assert.dom('ul li').exists({ count: 1 });
    assert.dom('ul li').hasText('oranges (awesome)');
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
    assert.dom(results[0]).hasText('apples');
    assert.dom(results[1]).hasText('bananas');
    assert.dom(results[2]).hasText('oranges');

    run(() => {
      get(this, 'collection').pushObject('mangoes');
    });

    assert.dom('ul li').exists({ count: 4 });
  });
});
