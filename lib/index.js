/**
 * Check whether a website is closed now for the given channel, according to its business hours configuration.
 *
 * @param businessHoursConfig Business hours configuration. It has the shape documented in TODO.
 * @param channel Channel to check. Possible channels include CHATBOT, WHATSAPP.
 * @param now (Optional) Reference time. Defaults to current time.
 * @return {boolean} Whether the website is closed for the given channel according to its configuration. If configuration
 * is missing, returns false (ie. always open).
 */
const isWebsiteClosedNow = function(businessHoursConfig, channel, now = new Date()) {
  if (businessHoursConfig) {
    const { enabled_channels, business_hours } = businessHoursConfig

    let time_zone = businessHoursConfig.time_zone ? businessHoursConfig.time_zone : '';
    if(!!time_zone){
      let time_zone_offset = now.getTimezoneOffset() / 60;
      let time_zone_offset_positive = now.toString().includes('GMT+')
      let time_zone_format = parseInt(time_zone.split(':')[0]);

      let time_zone_join = (time_zone_offset_positive) ? 
                  time_zone_format - time_zone_offset : 
                  time_zone_format + time_zone_offset;

      now.setTime(now.getTime() + (time_zone_join*60*60*1000));
    } 

    if (enabled_channels && enabled_channels[channel] === true && business_hours && business_hours.length) {
      const timestamp = weekTimestamp(now)
      return !business_hours.some(entry => entry.start <= timestamp && timestamp <= entry.end)
    }
  }
  // Return as always open
  return false
}

/**
 * Get the start of week for the given date, ie. Monday at midnight.
 *
 * @param now Reference time.
 * @return {Date} Date object representing the start of week.
 * @see <a href="https://stackoverflow.com/a/13682065">StackOverflow inspiration</a>
 */
const startOfWeek = now => {
  const result = new Date(now)
  // set to Monday of this week
  result.setDate(now.getDate() - (now.getDay() + 6) % 7)
  // Set to midnight
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get the number of seconds between the Monday immediately preceding the given time (at midnight) and the given time.
 *
 * @param now Reference time.
 * @return {number} Seconds difference within the week, with Monday @ 00:00:00UTC as start.
 */
const weekTimestamp = now => {
  // Get diff in seconds from start of week
  return (now.getTime() - startOfWeek(now).getTime()) / 1000
}

module.exports = {
  isWebsiteClosedNow,
}
