export class Service {
  dataAccess = null;
  constructor(dataAccess) {
    this.dataAccess = dataAccess;
  }

  getDataAccess() {
    return this.dataAccess;
  }
}
