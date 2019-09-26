"use strict";

/**
 * Check whether a website is closed now for the given channel, according to its business hours configuration.
 *
 * @param businessHoursConfig Business hours configuration. It has the shape documented in TODO.
 * @param channel Channel to check. Possible channels include CHATBOT, WHATSAPP.
 * @param now (Optional) Reference time. Defaults to current time.
 * @return {boolean} Whether the website is closed for the given channel according to its configuration. If configuration
 * is missing, returns false (ie. always open).
 */
var isWebsiteClosedNow = function isWebsiteClosedNow(businessHoursConfig, channel) {
  var now = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date();

  if (businessHoursConfig) {
    var enabled_channels = businessHoursConfig.enabled_channels,
        business_hours = businessHoursConfig.business_hours;

    if (enabled_channels && enabled_channels[channel] === true && business_hours) {
      var _weekTimestamp = _weekTimestamp(now);

      return !business_hours.some(function (entry) {
        return entry.start <= _weekTimestamp && _weekTimestamp <= entry.end;
      });
    }
  } // Return as always open


  return false;
};
/**
 * Get the Monday preceding the given date at midnight (if now is a Monday, just to back to midnight).
 *
 * @param now Reference time.
 * @return {number} UNIX timestamp of the preceding Monday, <b>in milliseconds</b>.
 * @see <a href="https://stackoverflow.com/a/35088292">StackOverflow inspiration</a>
 */


var precedingMondayMillis = function precedingMondayMillis(now) {
  var dayOfWeek = now.getDay();
  var previousMonday;

  if (dayOfWeek >= 1) {
    previousMonday = new Date().setDate(now.getDate() - dayOfWeek + 1);
  } else {
    previousMonday = new Date().setDate(now.getDate() - 6);
  } // Set to start of day


  return previousMonday.setHours(0, 0, 0, 0);
};
/**
 * Get the number of seconds between the Monday immediately preceding the given time (at midnight) and the given time.
 *
 * @param now Reference time.
 * @return {number} Seconds difference within the week, with Monday @ 00:00:00UTC as start.
 */


var weekTimestamp = function weekTimestamp(now) {
  // Get diff in seconds from previous Monday
  return (now.getTime() - precedingMondayMillis(now)) / 1000;
};

module.exports = {
  isWebsiteClosedNow: isWebsiteClosedNow
};