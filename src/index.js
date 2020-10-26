
class Holiday {
  // Assume startDate and endDate have the same day.
  constructor({
    name,
    startDate = new Date(),
    endDate = null, optional= false}) {
    this.name = name;
    this.startDate = startDate;
    if (endDate) {
      this.endDate = endDate
    } else {
      this.endDate = new Date(startDate);
      this.endDate.setDate(this.endDate.getDate() + 1);
      this.endDate.setHours(23,59,59,999);
    }
    this.optional = optional;
  }

  isPresent(d=new Date()) {
    return (
      this.startDate.getTime() <= d.getTime() &&
      d.getTime() < this.endDate.getTime()
    );
  }
}

function getNthDayOf(n, day, month, year) {
  const firstOfMonth = new Date(Date.parse(`${month}/1/${year} GMT`));

  let dayOffset = firstOfMonth.getUTCDay() - day;
  if (dayOffset > 0) {
    dayOffset = 7 - dayOffset;
  } else {
    dayOffset = -dayOffset;
  }
  const initialDay = firstOfMonth.getUTCDate() + dayOffset;

  const finalDay = initialDay + 7 * (n - 1);
  return new Date(Date.parse(`${month}/${finalDay}/${year} GMT`));
}

function getLastDayOf(day, month, year) {
  const firstOfDay = getNthDayOf(1, day, month, year).getUTCDate();
  const daysInMonth = new Date(year, month, 0).getUTCDate() - 7;

  let lastOfDay = firstOfDay;
  while (lastOfDay <= daysInMonth) {
    lastOfDay += 7;
  }

  return new Date(Date.parse(`${month}/${lastOfDay}/${year} GMT`));
}

function allFederalHolidaysForYear(year = new Date().getFullYear()) {
  const holidays = [];

  // New Year's Day
  holidays.push(new Holiday({
    name: `New Year's Day`,
    startDate: new Date(Date.parse(`1/1/${year} GMT`)),
  }));

  // Birthday of Martin Luther King, Jr.
  // Third Monday of January; fun fact: actual birthday is January 15
  holidays.push(new Holiday({
    name: `Birthday of Martin Luther King, Jr.`,
    startDate: getNthDayOf(3, 1, 1, year),
    optional: true
  }));

  // Washington's Birthday
  // Third Monday of February; fun fact: actual birthday is February 22
  // Fun fact 2: officially "Washington's Birthday," not "President's Day"
  holidays.push(new Holiday({
    name: `Washington's Birthday`,
    startDate: getNthDayOf(3, 1, 2, year),
    optional: true
  }));

  // Memorial Day
  // Last Monday of May
  holidays.push(new Holiday({
    name: `Memorial Day`,
    startDate: getLastDayOf(1, 5, year)
  }));

  // Independence Day
  holidays.push(new Holiday({
    name: `Independence Day`,
    startDate: new Date(Date.parse(`7/4/${year} GMT`))
  }));

  // Labor Day
  // First Monday in September
  holidays.push(new Holiday({
    name: `Labor Day`,
    startDate: getNthDayOf(1, 1, 9, year)
  }));

  // Columbus Day
  // Second Monday in October
  holidays.push(new Holiday({
    name: `Columbus Day`,
    startDate: getNthDayOf(2, 1, 10, year),
    optional: true
  }));

  // Thanksgiving Day
  // Fourth Thursday of November
  holidays.push(new Holiday({
    name: `Thanksgiving Day`,
    startDate: getNthDayOf(4, 4, 11, year)
  }));

  // Veterans Day
  holidays.push(new Holiday({
    name: `Veterans Day`,
    startDate: new Date(Date.parse(`11/11/${year} GMT`)),
    optional: true
  }));

  // "Christmas Eve (after 3pm)": "12/24"
  holidays.push(new Holiday({
    name: 'Christmas Eve',
    startDate: new Date(Date.parse(`15:00 12/24/${year} GMT`)),
  }))

  // Christmas Day
  holidays.push(new Holiday({
    name: `Christmas Day`,
    startDate: new Date(Date.parse(`12/25/${year} GMT`)),
  }));

  // "New Year’s Eve (after 3pm)": "12/31"
  holidays.push(new Holiday({
    name: 'New Year’s Eve',
    startDate: new Date(Date.parse(`15:00 12/31/${year} GMT`)),
  }))

  holidays.forEach(holiday => {
    holiday.dateString = `${holiday.startDate.getUTCFullYear()}-${holiday.startDate.getUTCMonth() +
      1}-${holiday.startDate.getUTCDate()}`;
  });

  return holidays;
}

function isAHoliday(date = new Date(), useOptionalHolidays = false) {
  const year = date.getUTCFullYear();

  // Get the holidays this year, plus check if New Year's Day of next year is
  // observed on December 31 and if so, add it to this year's list.
  let allForYear = allFederalHolidaysForYear(year);
  const nextYear = allFederalHolidaysForYear(year + 1);
  if (nextYear[0].startDate.getUTCFullYear() === year) {
    allForYear.push(nextYear[0]);
  }

  if (!useOptionalHolidays) {
    allForYear = allForYear.filter(h => !h.optional);
  }

  // If any dates in this year's holiday list match the one passed in, then
  // the passed-in date is a holiday.  Otherwise, it is not.
  return allForYear.some(holiday => holiday.isPresent(date));
}

module.exports = {
  isAHoliday,
  allForYear: allFederalHolidaysForYear,
};
