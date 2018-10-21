import lodash from "lodash";
import axios  from 'axios';
import { logger } from './Logger';

function getUSDValue() {
   return axios.get('https://belarusbank.by/api/kursExchange')
       .then((res) => {
           const USD_in = parseFloat(res.data[0].USD_in);
           const USD_out = parseFloat(res.data[0].USD_out);
           const USD = (USD_in + USD_out) / 2;
           logger.log('Got USD exchange rate', '',
           `USD in: ${USD_in}`,
           `USD out: ${USD_out}`,
           `USD exchange rate: ${USD}`);
           return USD;
        })
       .catch((err) => console.log(err));
}

export default function convert(array) {
    return getUSDValue()
        .then((res) => {
            const USD_value = res;
            return array.map(element => {
                if (element.Price) {
                    let currency = lodash.takeRight(element.Price, 3).join('');
                    let price = parseFloat(lodash.slice(element.Price, 0, element.Price.length - 4).join(''));
                    if (currency !== 'USD') {
                        price = price / USD_value;
                        price = parseInt(price, 10);
                        if (price < 1) price = 1;
                    }
                    element.Price = price;
                }
                return element;
            });
        });
}
