import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { A as emberArray } from '@ember/array';
import { run } from '@ember/runloop';

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

  assert.equal(this.$('ul li').length, 3);
  assert.equal(this.$('ul li:eq(0)').text().trim(), 'apples');
  assert.equal(this.$('ul li:eq(1)').text().trim(), 'bananas');
  assert.equal(this.$('ul li:eq(2)').text().trim(), 'oranges');
});

test('it can have zero results', function(assert) {
  this.set('collection', emberArray(['apples', 'bananas', 'oranges']));

  this.render(hbs`
    {{#unless (search "kirby" collection)}}
      <p>No results.</p>
    {{/unless}}
  `);

  assert.equal(this.$('p').text().trim(), 'No results.');
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

  assert.equal(this.$('ul li').length, 1);
  assert.equal(this.$('ul li:eq(0)').text().trim(), 'apples');
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

  assert.equal(this.$('ul li').length, 1);
  assert.equal(this.$('ul li:eq(0)').text().trim(), 'oranges');
});

test('the results can be forced to match the case of the query', function(assert) {
  this.set('collection', emberArray(['apples', 'bananas', 'oranges']));

  this.render(hbs`
    {{#unless (search "GES" collection sensitive=true)}}
      <p>No results.</p>
    {{/unless}}
  `);

  assert.equal(this.$('p').text().trim(), 'No results.');
});

test('the results change when the query changes', function(assert) {
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

  assert.equal(this.$('ul li').length, 1);
  assert.equal(this.$('ul li:eq(0)').text().trim(), 'apples');

  this.$('input').val('bananas');
  this.$('input').trigger('change');

  assert.equal(this.$('ul li').length, 1);
  assert.equal(this.$('ul li:eq(0)').text().trim(), 'bananas');
});

test('searchableProperties can be an array of synchronous props', function(assert) {
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

  assert.equal(this.$('ul li').length, 1);
  assert.equal(this.$('ul li:eq(0)').text().trim(), 'apples (okay)');

  this.$('input').val('awesome');
  this.$('input').trigger('change');

  assert.equal(this.$('ul li').length, 1);
  assert.equal(this.$('ul li').text().trim(), 'oranges (awesome)');
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

  assert.equal(this.$('ul li').length, 3);
  assert.equal(this.$('ul li:eq(0)').text().trim(), 'apples');
  assert.equal(this.$('ul li:eq(1)').text().trim(), 'bananas');
  assert.equal(this.$('ul li:eq(2)').text().trim(), 'oranges');

  run(() => {
    this.get('collection').pushObject('mangoes');
  });

  assert.equal(this.$('ul li').length, 4);
});


