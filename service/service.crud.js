export class ServiceCRUD {
  dataAccess = null;
  constructor(dataAccess) {
    this.dataAccess = dataAccess;
  }

  getDataAccess() {
    return this.dataAccess;
  }

  async find(cond, page, perPage) {
    return await this.getDataAccess().find(cond, page, perPage);
  }

  async create(data) {
    return await this.getDataAccess().create(data);
  }

  async findById(Id) {
    return await this.getDataAccess().findById(Id);
  }

  async update(Id, record) {
    return await this.getDataAccess().update(Id, record);
  }

  async delete(Id) {
    return await this.getDataAccess().delete(Id);
  }
}
