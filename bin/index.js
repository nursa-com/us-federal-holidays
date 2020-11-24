"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Holiday = function () {
  function Holiday(_ref) {
    var name = _ref.name,
        _ref$startDate = _ref.startDate,
        startDate = _ref$startDate === void 0 ? new Date() : _ref$startDate,
        _ref$endDate = _ref.endDate,
        endDate = _ref$endDate === void 0 ? null : _ref$endDate,
        _ref$optional = _ref.optional,
        optional = _ref$optional === void 0 ? false : _ref$optional;

    _classCallCheck(this, Holiday);

    this.name = name;
    this.startDate = startDate;

    if (endDate) {
      this.endDate = endDate;
    } else {
      this.endDate = new Date(startDate);
      this.endDate.setUTCHours(23, 59, 59, 999);
    }

    this.optional = optional;
  }

  _createClass(Holiday, [{
    key: "isPresent",
    value: function isPresent() {
      var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
      return this.startDate.getTime() <= d.getTime() && d.getTime() < this.endDate.getTime();
    }
  }]);

  return Holiday;
}();

function getNthDayOf(n, day, month, year) {
  var firstOfMonth = new Date(Date.parse("".concat(month, "/1/").concat(year, " GMT")));
  var dayOffset = firstOfMonth.getUTCDay() - day;

  if (dayOffset > 0) {
    dayOffset = 7 - dayOffset;
  } else {
    dayOffset = -dayOffset;
  }

  var initialDay = firstOfMonth.getUTCDate() + dayOffset;
  var finalDay = initialDay + 7 * (n - 1);
  return new Date(Date.parse("".concat(month, "/").concat(finalDay, "/").concat(year, " GMT")));
}

function getLastDayOf(day, month, year) {
  var firstOfDay = getNthDayOf(1, day, month, year).getUTCDate();
  var daysInMonth = new Date(year, month, 0).getUTCDate() - 7;
  var lastOfDay = firstOfDay;

  while (lastOfDay <= daysInMonth) {
    lastOfDay += 7;
  }

  return new Date(Date.parse("".concat(month, "/").concat(lastOfDay, "/").concat(year, " GMT")));
}

function allFederalHolidaysForYear() {
  var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date().getFullYear();
  var holidays = [];
  holidays.push(new Holiday({
    name: "New Year's Day",
    startDate: new Date(Date.parse("1/1/".concat(year, " GMT")))
  }));
  holidays.push(new Holiday({
    name: "Birthday of Martin Luther King, Jr.",
    startDate: getNthDayOf(3, 1, 1, year),
    optional: true
  }));
  holidays.push(new Holiday({
    name: "Washington's Birthday",
    startDate: getNthDayOf(3, 1, 2, year),
    optional: true
  }));
  holidays.push(new Holiday({
    name: "Memorial Day",
    startDate: getLastDayOf(1, 5, year)
  }));
  holidays.push(new Holiday({
    name: "Independence Day",
    startDate: new Date(Date.parse("7/4/".concat(year, " GMT")))
  }));
  holidays.push(new Holiday({
    name: "Labor Day",
    startDate: getNthDayOf(1, 1, 9, year)
  }));
  holidays.push(new Holiday({
    name: "Columbus Day",
    startDate: getNthDayOf(2, 1, 10, year),
    optional: true
  }));
  holidays.push(new Holiday({
    name: "Thanksgiving Day",
    startDate: getNthDayOf(4, 4, 11, year)
  }));
  holidays.push(new Holiday({
    name: "Veterans Day",
    startDate: new Date(Date.parse("11/11/".concat(year, " GMT"))),
    optional: true
  }));
  holidays.push(new Holiday({
    name: 'Christmas Eve',
    startDate: new Date(Date.parse("15:00 12/24/".concat(year, " GMT")))
  }));
  holidays.push(new Holiday({
    name: "Christmas Day",
    startDate: new Date(Date.parse("12/25/".concat(year, " GMT")))
  }));
  holidays.push(new Holiday({
    name: 'New Year’s Eve',
    startDate: new Date(Date.parse("15:00 12/31/".concat(year, " GMT")))
  }));
  holidays.forEach(function (holiday) {
    holiday.dateString = "".concat(holiday.startDate.getUTCFullYear(), "-").concat(holiday.startDate.getUTCMonth() + 1, "-").concat(holiday.startDate.getUTCDate());
  });
  return holidays;
}

function isAHoliday() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var useOptionalHolidays = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var year = date.getUTCFullYear();
  var allForYear = allFederalHolidaysForYear(year);
  var nextYear = allFederalHolidaysForYear(year + 1);

  if (nextYear[0].startDate.getUTCFullYear() === year) {
    allForYear.push(nextYear[0]);
  }

  if (!useOptionalHolidays) {
    allForYear = allForYear.filter(function (h) {
      return !h.optional;
    });
  }

  return allForYear.some(function (holiday) {
    return holiday.isPresent(date);
  });
}

module.exports = {
  isAHoliday: isAHoliday,
  allForYear: allFederalHolidaysForYear
};