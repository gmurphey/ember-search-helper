import Controller from '@ember/controller';
import { mapBy } from '@ember/object/computed';
import { A as emberArray } from '@ember/array';

export default Controller.extend({
  properties: mapBy('selectedProperties', 'value'),

  selectedProperties: emberArray(),
  availableProperties: emberArray([
    {
      value: 'firstName',
      displayName: 'First Name'
    },
    {
      value: 'lastName',
      displayName: 'Last Name'
    },
    {
      value: 'job',
      displayName: 'Job'
    }
  ])
});
