import { module, test } from 'qunit';
import { visit, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | demo', function(hooks) {
  setupApplicationTest(hooks);

  test('the table is rendered with all results by default', async function(assert) {
    await visit('/');

    assert.dom('table > tbody > tr').exists({ count: 5 });
    assert.dom('#results').doesNotContainText('No results.');
  });

  test('the table is searchable', async function(assert) {
    await visit('/');
    await fillIn('#query-field', 'sandra');

    assert.dom('table > tbody > tr').exists({ count: 1 }, 'the table is filtered down to a single result');
  });

  test('the case sensitive checkbox works', async function(assert) {
    await visit('/');
    await fillIn('#query-field', 'sandra');
    await click('#case-sensitive-field');

    assert.dom('table > tbody > tr').doesNotExist();
    assert.dom('#results').matchesText('No results.');

    await fillIn('#query-field', 'Sandra');

    assert.dom('table > tbody > tr').exists({ count: 1 });
    assert.dom('#results').doesNotContainText('No results.');
  });

  test('the exact match checkbox works', async function(assert) {
    await visit('/');
    await fillIn('#query-field', 'sandr');
    await click('#exact-match-field');

    assert.dom('table > tbody > tr').doesNotExist();
    assert.dom('#results').matchesText('No results.');

    await fillIn('#query-field', 'Sandra');

    assert.dom('table > tbody > tr').exists({ count: 1 }, 'the table is filtered down to a single exact match result');
    assert.dom('#results').doesNotContainText('No results.');
  });
});
