export const isPlainObj = (o) => {
  let result =
    o &&
    o.constructor &&
    o.constructor.prototype &&
    o.constructor.prototype.hasOwnProperty("isPrototypeOf");
  result = Boolean(result);
  return result;
};

export const extractFields = (dto, dbObject) => {
  if (!dbObject) return dto;

  for (const key of Object.keys(dto)) {
    if (dbObject[key]) {
      const val = dbObject[key];
      const myval = dto[key];

      if (isPlainObj(myval)) {
        const res = extractFields(myval, val);
        dto[key] = res;
        continue;
      }
      dto[key] = dbObject[key];
    }
  }
  dto.id = dto._id || dto.id;
  dto.id = String(dto.id);
  return dto;
};

export const flattenObj = (obj, keys = []) => {
  return Object.keys(obj).reduce((acc, key) => {
    const check = isPlainObj(obj[key]) || !isPrimitive(obj[key]);
    return Object.assign(
      acc,
      check
        ? flattenObj(obj[key], keys.concat(key))
        : { [keys.concat(key).join(".")]: obj[key] }
    );
  }, {});
};

export const isPrimitive = (test) => {
  return test !== Object(test);
};

export const createEnum = (object) => {
  return Object.freeze(object);
};
