import mongoose from 'mongoose';
import retry from 'retry-as-promised';
import Promise from 'bluebird';

import DataSource from './modules/datasources/';
import { updateFlatRecords } from './modules/mainLogic';
import Flat from './models/flats/flat';


const ds = new DataSource();

const uri = process.env.MONGO_FLATS;

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


runner();

// runner().then(() => {
//       logger.log('run ended', '',
//           `run end time: ${ date.format(new Date(), 'HH:mm:ss') }`,
//           `next run will be in ${ reload } hours since now`);
//           return 'run ended';
// });
