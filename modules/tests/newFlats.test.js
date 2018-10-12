import { getNewFlats } from '../datasources/hatka-by';

test('returns not empty array', () => {
    expect(getNewFlats('https://www.hata.by/rent-flat/grodno/')).not.toBeUndefined();
});
