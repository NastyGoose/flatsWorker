import cheerio from 'cheerio';
import rp from 'request-promise';
import jsonframe from 'jsonframe-cheerio';
import converter from '../converter';
import { logger } from '../Logger';

function getNewPage($) {
    let url = null;
    $('a.b-pagination__item.b-pagination__item_nav.next').each(function () {
        url = $(this).attr('href');
    });
    return url;
}

function parseData(url) {
    return rp(url)
        .then(function (body) {
            logger.log('parse started: ', '', `URL: ${url}`);
            const $ = cheerio.load(body);
            jsonframe($);
            let frame = {
                flats: {
                    _s: ".b-catalog-table__item",
                    _d: [{
                        "Address": "h3[class=title]",
                        "Price": "div[class=value]",
                        "Description": "div[class=description]",
                        "Photo": "img[class=img-fluid] @ src",
                        "URL": "a[target=_blank] @ href",
                    }]
                }
            };
            // Adding to flats array data from array that store this pages flats info
            return {
                flats: $('body').scrape(frame).flats,
                $: $
            };
        })
        .catch((err) => logger.error(err));
}


export default async function getNewFlats(url) {
    let newFlatsList = [];
    if(!url) url = 'https://www.hata.by/rent-flat/grodno/';
    while(url) {
        const results = await parseData(url);
        newFlatsList.push(...results.flats);
        url = getNewPage(results.$);
    }
    return converter(newFlatsList);
}
