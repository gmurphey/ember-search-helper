import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { A as emberArray } from '@ember/array';
import faker from 'faker';

export default Route.extend({
  model() {
    let results = emberArray();

    for (let i = 0; i < 10; i++) {
      results.pushObject({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        job: faker.name.jobType()
      });
    }

    return results;
  },

  setupController(controller) {
    this._super(...arguments);

    set(controller, 'selectedProperties', emberArray([...get(controller, 'availableProperties')]));
  }
});
