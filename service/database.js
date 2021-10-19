import { Types } from "mongoose";
import { DBSort } from "../dao/sorting";

const ID = Types.ObjectId;

export class DatabaseService {
  model;
  constructor(model) {
    this.model = model;
  }

  async find(
    cond,
    page = 1,
    perPage = 10,
    populate = [],
    omit = {},
    sort = { createdAt: DBSort.DESCENDING }
  ) {
    if (page < 1) {
      throw Error("Page cannot be smaller than 1");
    }
    if (perPage < 1) {
      throw new Error("perPage cannot be smaller than 1");
    }
    let skip = (page - 1) * perPage;
    skip = page > 1 ? skip - 1 : skip;
    const limit = page > 1 ? perPage + 2 : perPage + 1; // get one extra result for checking more records

    let query = this.model.find(cond, omit);
    for (const p of populate) {
      query = query.populate(p);
    }
    query = query.skip(skip).limit(limit).sort(sort);
    let users = await query;

    const userCount = users.length;
    const hasPrevious = page > 1 && userCount > 0;
    const lower = hasPrevious ? 1 : 0;

    const hasNext = userCount > perPage + lower;
    const upper = hasNext ? perPage + lower : userCount;

    users = users.slice(lower, upper);

    const result = {
      data: users,
      pagination: {
        hasNext: hasNext,
        hasPrevious: hasPrevious,
        perPage: perPage,
        page: page,
        next: "",
        previous: "",
      },
    };

    return result;
  }

  async findById(Id, populate = [], omit = {}) {
    const id = ID(Id);
    let query = this.model.findById(id, omit);
    for (const p of populate) {
      query = query.populate(p);
    }
    let result = await query;
    //const result = await this.model.findById({ _id: id }, populate); // ADD Omit to not fetch some info
    if (result.data.length == 0)
      throw new Error(`record with id ${id} not found`);

    return result.data[0];
  }

  async update(Id, record, existing) {
    if (!existing) existing = await this.findById(Id);
    Object.entries(record).forEach(([key, value]) => (existing[key] = value));
    const result = await existing.save();
    return result;
  }

  async create(record) {
    const obj = new this.model(record);
    const result = await obj.save();
    return result;
  }

  async delete(Id, existing) {
    if (!existing) {
      existing = await this.findById(Id);
    }
    const result = await existing.remove();
    return result;
  }

  isPlainObj(o) {
    let result =
      o &&
      o.constructor &&
      o.constructor.prototype &&
      o.constructor.prototype.hasOwnProperty("isPrototypeOf");
    result = Boolean(result);
    return result;
  }

  flattenObj(obj, keys = []) {
    return Object.keys(obj).reduce((acc, key) => {
      return Object.assign(
        acc,
        this.isPlainObj(obj[key])
          ? this.flattenObj(obj[key], keys.concat(key))
          : { [keys.concat(key).join(".")]: obj[key] }
      );
    }, {});
  }
}
