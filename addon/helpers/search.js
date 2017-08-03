import Helper from '@ember/component/helper';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';

let searchHaystack = function(query, collection, properties, sensitive) {
  let testValue = function(value, sensitive) {
    value = String(value);

    if (!sensitive) {
      value = value.toLowerCase();
    }

    return (value.indexOf(query) !== -1);
  };

  if (isEmpty(query)) {
    return collection;
  }

  if (!sensitive) {
    query = query.toLowerCase();
  }

  return collection.filter((item) => {
    if (!isEmpty(properties)) {
      return properties.some((prop) => {
        return testValue(get(item, prop), sensitive);
      });
    } else {
      return testValue(item, sensitive);
    }
  });
};

export function search([ query, collection ], { properties = [], sensitive = false }) {
  return searchHaystack(query, collection, properties, sensitive);
}

export default Helper.helper(search);
