import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { A as emberArray } from '@ember/array';

export default Route.extend({
  model() {
    return emberArray([
      { firstName: 'Sandra', lastName: 'Dedo', position: 'Product Manager' },
      { firstName: 'Kelvin', lastName: 'Durgan', position: 'Project Manager' },
      { firstName: 'Garrett', lastName: 'Murphey', position: 'Software Developer' },
      { firstName: 'Marielle', lastName: 'Moore', position: 'Software Developer' },
      { firstName: 'Shyanne', lastName: 'Daugherty', position: 'Engineering Manager' }
    ]);
  },

  setupController(controller) {
    this._super(...arguments);

    set(controller, 'selectedProperties', emberArray([...get(controller, 'availableProperties')]));
  }
});
