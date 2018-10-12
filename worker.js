import mongoose from 'mongoose';
import retry from 'retry-as-promised';
import Promise from 'bluebird';
import date from 'date-and-time';

import DataSource from './modules/datasources/';
import { updateFlatRecords } from './modules/mainLogic';
import Flat from './models/flats/flat';

const ds = new DataSource();

const uri = process.env.MONGO_FLATS;
const reload = process.env.RELOAD_TIMEOUT;

const hour = 3600 * 1000;

const runner = () => {
    mongoose.connect(uri, {useNewUrlParser: true});

    const pr1 = retry(() => {
        return Flat.find({})
            .then(res => {
                return res;
            });
    }, {
        max: 10,
        timeout: 20000
    });

    const pr2 = retry(() => {
        return ds.getFlats()
            .then((result) => {
                return result;
            });
    }, {
        max: 20,
        timeout: 50000
    });

   return Promise.all([pr1, pr2])
        .then(([oldFlats, newFlats]) => {
            updateFlatRecords(oldFlats, newFlats);
        })
        .catch((err) => console.log(err));
};

const main = () => {
  console.log('run end time: ', date.format(new Date(), 'HH:mm:ss'));
  console.log('next run will be in', reload, 'hours since now');
  setTimeout(() => {
      runner().then(main);
  }, reload * hour);
};

runner().then(main);
