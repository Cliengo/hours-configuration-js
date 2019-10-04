const JS_SUNDAY = 0
const JS_MONDAY = 1
const JS_TUESDAY = 2
const JS_WEDNESDAY = 3
const JS_THURSDAY = 4
const JS_FRIDAY = 5
const JS_SATURDAY = 6

module.exports = {
  JS_SUNDAY,
  JS_MONDAY,
  JS_TUESDAY,
  JS_WEDNESDAY,
  JS_THURSDAY,
  JS_FRIDAY,
  JS_SATURDAY,

  /**
   * Calculate a week timestamp for the given time.
   *
   * @param day {number} Weekday, as per JavaScript (ie. 0 is Sunday. Use {@link JS_SUNDAY}, etc.)
   * @param hours {number} Hours.
   * @param minutes {number?} (Optional) Minutes. Default to 0.
   * @param seconds {number?} (Optional) Seconds. Defaults to 0.
   * @return {number} Week timestamp
   */
  weekTimestamp: (day, hours, minutes = 0, seconds = 0) => {
    // Our week starts at Monday, not Sunday. Correct day.
    if (day === JS_SUNDAY) {
      day = 6
    } else {
      day--;
    }

    return (day * 24 * 3600) + (hours * 3600) + (minutes * 60) + seconds
  },
}
