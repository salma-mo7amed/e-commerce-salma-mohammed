export class ApiFeature {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }
  pagination() {
    let { page, size } = this.queryData;
    page = parseInt(page);
    size = parseInt(size);
    if (page <= 0) page = 1;
    if (size <= 0) size = 2;
    const skip = (page - 1) * size;
    this.mongooseQuery.limit(size).skip(skip);
    return this;
  }
  sort() {
    this.mongooseQuery.sort(this.queryData.sort?.replaceAll(",", " "));
    return this;
  }
  select() {
    this.mongooseQuery.select(this.queryData.select?.replaceAll(",", " "));
    return this;
  }
  filter(){
    let {page, size, sort, select, ...filter} = this.queryData;
    filter = JSON.parse(JSON.stringify(filter).replace(/gt|gte|lt|lte/g, match => `$${match}`))
    this.mongooseQuery.find(filter)
    return this
  }
}
