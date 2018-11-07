import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';
import elasticsearch from 'elasticsearch';

const esClient = new elasticsearch.Client({ host: 'https://l8ii803f3u:n4p2abo2z3@cedar-2548810.us-east-1.bonsaisearch.net' });

const FlatSchema = new mongoose.Schema({
  Address: {
    type: String,
    default: '',
    unique: true,
    es_indexed: true,
  },
  Price: {
    type: Number,
    default: '',
    es_indexed: true,
  },
  Description: {
    type: String,
    default: '',
  },
  Photo: {
    type: String,
    default: '',
  },
  AddDate: {
    type: Date,
    default: new Date(),
  },
  UpdateDate: {
    type: Date,
    default: new Date(),
    es_indexed: true,
  },
  URL: {
    type: String,
    default: '',
    unique: true,
  },
});

FlatSchema.plugin(mongoosastic, {
  hydrate: true,
  esClient,
});

export default mongoose.model('Flat', FlatSchema, 'flats');

