import lodash from 'lodash';
import Promise from 'bluebird';
import mongoose from 'mongoose';

import Flat from '../models/flats/flat';
import { logger } from './Logger';

export function updateFlatRecords(oldRecords, newRecords) {

    let store = {};

    // better method to create store through reduce method but it need to be fixed(later)
    // store = oldRecords.reduce((acc, curr) => {
    //     return acc[curr.Address] = curr.Price;
    // }, {});

    for (let i = 0; i < oldRecords.length; i++) {
        let key = oldRecords[i].Address;
        store[key] = oldRecords[i].Price;
    }

    const promises = newRecords.map((newFlat) => {
       if (newFlat.Price) {
           if (store[newFlat.Address]) {
               if (store[newFlat.Address] !== newFlat.Price) {

                   return Flat.update({Address: newFlat.Address}, {$set: {
                       Price: newFlat.Price,
                       UpdateDate: new Date()
                   }})
                       .then(() => {
                           logger.log('updating flat', newFlat.Address, [`previous price: ${store[newFlat.Address]}`,
                               `new price: ${newFlat.Price}`]);
                       });
               }
           }
           else {
               return Flat.create(newFlat)
                   .then(() => {
                       logger.log('creating flat', newFlat.Address, [`price: ${newFlat.Price}`]);
                   });
           }
       }
        });

    return Promise.all(promises)
        .then(() => {
        let toDelete = lodash.differenceBy(oldRecords, newRecords, 'Address');

        const pr = toDelete.map((item) => {
            return Flat.deleteOne(item)
                .then(() => {
                    logger.log('successfully deleted flat', item.Address);
                });
        });

        return Promise.all(pr)
            .then(() => mongoose.connection.close());
    })
        .catch(error => console.log(error));
}
