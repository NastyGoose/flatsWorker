import * as log4js from 'log4js';

import Log from '../models/logs/Log';

const _ = log4js.getLogger();
_.level = 'debug';
 export const logger = {
   log(event, address, ...addInfo) {
        _.debug('event: ', event, `
        info: `, addInfo, `
        flat: `, address, `
        time: `, new Date());

        Log.create({
            event,
            address,
            addInfo: addInfo.join('\n'),
        });
    }
};
