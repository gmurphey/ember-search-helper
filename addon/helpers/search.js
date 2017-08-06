import { helper } from '@ember/component/helper';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { A as emberArray } from '@ember/array';

let testValue = function(value, query, caseSensitive, exactMatch) {
  value = String(value);

  if (!caseSensitive) {
    value = value.toLowerCase();
  }

  return (exactMatch) ? (value === query) : (value.indexOf(query) !== -1);
};

export function search([ query, collection ], { properties=[], caseSensitive=false, exactMatch=false }) {
  if (isEmpty(query) || isEmpty(collection)) {
    return collection;
  }

  if (!caseSensitive) {
    query = query.toLowerCase();
  }

  let collectionLength = get(collection, 'length');
  let propertiesLength = get(properties, 'length');
  let foundItems = emberArray();

  for (let i = 0; i < collectionLength; i++) {
    let item = collection.objectAt(i);

    if (propertiesLength) {
      for (let x = 0; x < propertiesLength; x++) {
        let value = get(item, properties.objectAt(x));

        if (testValue(value, query, caseSensitive, exactMatch)) {
          foundItems.pushObject(item);
          break;
        }
      }
    } else {
      if (testValue(item, query, caseSensitive, exactMatch)) {
        foundItems.pushObject(item);
      }
    }
  }

  return foundItems;
}

export default helper(search);
