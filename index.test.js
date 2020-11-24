const tap = require('tap');

const federalHolidays = require('./src/index');

const getDate = dateString => new Date(`${dateString} 00:00:00`);

const getDateUTC = dateString => new Date(`${dateString}T00:00:00Z`);

tap.test('handles standard federal holidays', async tests => {
  tests.test(
    'should be holiday',
    async test => {
      [
        // '2010-12-31', // New Year's Day falls on a Saturday, observed before
        // '2012-01-02', // New Year's Day falls on a Sunday, observed after
        '2014-01-01',
        '2014-01-20',
        '2014-02-17',
        '2014-05-26',
        '2014-07-04',
        '2014-09-01',
        '2014-10-13',
        '2014-11-11',
        '2014-11-27',
        '2014-12-25',
        // // '2015-07-03', // Independence Day falls on a Saturday, observed before
        // '2016-12-26', // Christmas Day falls on a Sunday, observed after
        '2017-12-25',
        '2020-11-26',
      ].forEach(dateString => {
        const utcDate = getDateUTC(dateString);


        // It doesn't work, because when I create date obj set to midnight new
        // year's eve, I get 2010-12-30 23:00:00 UTC and that's an hour early
        // for a holiday. Dates for check should be really passed only in UTC,
        // because we compare them with holidays defined in utc.
        // test.ok(
        //   federalHolidays.isAHoliday(date, { useOptionalHolidays: true }),
        //   `${dateString} is a holiday (observed)`
        // );

        test.ok(
          federalHolidays.isAHoliday(utcDate, true),
          `${dateString} UTC is a holiday (observed)`
        );
      });
    }
  );

  tests.test(
    'should not be holiday',
    async test => {
      [
        '2020-11-27',
      ].forEach(dateString => {
        const utcDate = getDateUTC(dateString);
        test.ok(
          !federalHolidays.isAHoliday(utcDate, true),
          `${dateString} UTC is a holiday (observed)`
        );
      });
    }
  );

});
