class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
  
    //excluded this field as we want to implement it seperately and it doesn't come under query
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    //After specifying any gte or lt like suymbol in url, 
    // req.query = { difficulty : 'easy', duration : { gte: 5 }}
    //IN MONGOOSE, We write as to filter: { difficulty : 'easy', duration : { $gte: 5 }}
    //So just replacing that sign here...
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // refer: https://mongoosejs.com/docs/api/query.html#query_Query-sort
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      //   query = query.sort('-createdAt');
      this.query = this.query.sort('_id');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      //it selects only the specifies in the "fields" variable defined above:
      //for more detail: https://mongoosejs.com/docs/api/query.html#query_Query-select
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // limit defines the number of results per page
    // page: the page that we want
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
    // to get all documents that exists in a certain collecton, we van use "countDocuments"
    //More: https://mongoosejs.com/docs/api/model.html#model_Model.countDocuments
    //just to get total documents to help implement pagination
  }
}

module.exports = APIFeatures;
