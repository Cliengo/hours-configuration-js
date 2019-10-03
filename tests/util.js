const moment = require('moment')

module.exports = {
  /**
   * Calculate a week timestamp for the given time.
   *
   * @param day Weekday. 0 is Monday, <b>NOT</b> Sunday.
   * @param hours Hours.
   * @param minutes Minutes.
   * @return {number} Week timestamp
   */
  weekTimestamp: (day, hours, minutes) =>
    (day * 24 * 3600) + (hours * 3600) + (minutes * 60),

  dayOfWeek: (dayOfWeek, hours = 0, minutes = 0) =>
    moment(dayOfWeek).hours(hours).minutes(minutes).toDate(),
}
