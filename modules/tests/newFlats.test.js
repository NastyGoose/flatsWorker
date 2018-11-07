import { getNewFlats } from '../datasources/hatka-by';
import nock from 'nock';
import mongoose from 'mongoose';

describe('returns not empty array', function () {
    it('Parser returns not empty object', (done) => {
        getNewFlats('https://www.hata.by/rent-flat/grodno/').should.not.toBeUndefined();
        done();
    }
    );
});
