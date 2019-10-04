const rewire = require('rewire')
const util = require('./util')
const HoursConfig = rewire('../lib/index.js')

const CHATBOT = 'CHATBOT'
const WHATSAPP = 'WHATSAPP'

const CONFIG = {
  enabled_channels: {
    [CHATBOT]: true,
    [WHATSAPP]: true
  },
  business_hours: [
    {
      // Monday 00-15
      start: 0,
      end: util.weekTimestamp(util.JS_MONDAY, 15)
    }
  ]
}

describe('startOfWeek', () => {
  const startOfWeek = HoursConfig.__get__('startOfWeek') // Private function, exposed with rewire

  /**
   * High-order test function, returns a test suite with common assertions for a given date. Tests:
   * <ul>
   *   <li>Day is 1 (Monday)</li>
   *   <li>Hours is 0</li>
   *   <li>Minutes is 0</li>
   *   <li>Seconds is 0</li>
   *   <li>Millis is 0</li>
   * </ul>
   *
   * @param date {Date} Reference date to test.
   * @param extraTests {function?} (Optional) Extra tests to perform. Receives the passed date.
   */
  const testFor = (date, extraTests) => {
    test(`works correctly for ${date.toISOString()}`, () => {
      const monday = startOfWeek(date)
      expect(monday.getDay()).toBe(1)
      expect(monday.getHours()).toBe(0)
      expect(monday.getMinutes()).toBe(0)
      expect(monday.getSeconds()).toBe(0)
      expect(monday.getTime()).toBeLessThanOrEqual(date.getTime())
      if (extraTests) {
        extraTests(date)
      }
    })
  }

  testFor(new Date()) // Now
  testFor(new Date("2019-10-01")) // Tuesday, Oct 1 (UTC) = Monday, Sept 30 @ 9pm in Buenos Aires
  testFor(new Date("2019-09-30")) // Monday, Sept 30 (UTC) = Sunday, Sept 29 @ 9pm in Buenos Aires
  testFor(new Date("2019-09-30T00:00-03:00")) // Tuesday, Oct 1 (Buenos Aires)

  test('is timezone-independent', () => {
    const nowBuenosAires = new Date("2019-10-04T11:13-03:00"),
          nowTokyo = new Date("2019-10-04T23:13+09:00")

    expect(nowBuenosAires.getTime()).toBe(nowTokyo.getTime()) // Make sure they are the same instant
    expect(startOfWeek(nowBuenosAires)).toEqual(startOfWeek(nowTokyo))
  })
})

describe('weekTimestamp', () => {
  const weekTimestamp = HoursConfig.__get__('weekTimestamp') // Private function, exposed with rewire

  /**
   * High-order test function, returns a test that checks that the week timestamp is the same as one calculated manually.
   *
   * @param date {Date} Reference date to test.
   * @param extraTests {function?} (Optional) Extra tests to perform. Receives the passed date.
   */
  const testFor = (date, extraTests) => {
    test(`works correctly for ${date.toISOString()}`, () => {
      const timestamp = weekTimestamp(date)
      const integerTimestamp = parseInt(timestamp, 10) // JS doesn't have a truncate method (WTF) and this can return decimals. Truncate.
      expect(integerTimestamp).toEqual(util.weekTimestamp(date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds()))
      if (extraTests) {
        extraTests(date)
      }
    })
  }

  testFor(new Date()) // Now
  testFor(new Date("2019-10-01")) // Tuesday, Oct 1 (UTC) = Monday, Sept 30 @ 9pm in Buenos Aires
  testFor(new Date("2019-09-30")) // Monday, Sept 30 (UTC) = Sunday, Sept 29 @ 9pm in Buenos Aires
  testFor(new Date("2019-09-30T00:00-03:00")) // Tuesday, Oct 1 (Buenos Aires)

  test('is timezone-independent', () => {
    const nowBuenosAires = new Date("2019-10-04T11:13-03:00"),
      nowTokyo = new Date("2019-10-04T23:13+09:00")

    expect(nowBuenosAires.getTime()).toBe(nowTokyo.getTime()) // Make sure they are the same instant
    expect(weekTimestamp(nowBuenosAires)).toEqual(weekTimestamp(nowTokyo))
  })
})

describe('isWebsiteClosedNow', () => {

  /**
   * High-order test function, returns a generic test that checks that {@link HoursConfig.isWebsiteClosedNow} returns an
   * expected value for given parameters.
   *
   * @param date {Date} Reference date.
   * @param expectedResult {boolean} Expected result
   * @param channel {string?} (Optional) Channel to check. Defaults to {@link CHATBOT}.
   */
  const testFor = (date, expectedResult, channel = CHATBOT) => {
    test(`returns ${expectedResult} for ${date.toISOString()}`, () => {
      expect(HoursConfig.isWebsiteClosedNow(CONFIG, channel, date)).toBe(expectedResult)
    })
  }

  testFor(new Date(2019, 9, 4), true)
  testFor(new Date(2019, 9, 7, 12), false)
  testFor(new Date(2019, 9, 7, 16), true)

  test('is timezone-independent', () => {
    const nowBuenosAires = new Date("2019-10-04T11:13-03:00"),
      nowTokyo = new Date("2019-10-04T23:13+09:00")

    expect(nowBuenosAires.getTime()).toBe(nowTokyo.getTime()) // Make sure they are the same instant
    expect(HoursConfig.isWebsiteClosedNow(CONFIG, CHATBOT, nowBuenosAires))
      .toEqual(HoursConfig.isWebsiteClosedNow(CONFIG, CHATBOT, nowTokyo))
  })

  test('returns false within business hours for a disabled channel', () => {
    CONFIG.enabled_channels.CHATBOT = false
    expect(HoursConfig.isWebsiteClosedNow(CONFIG, CHATBOT, new Date(2019, 9, 7, 12))).toBe(false)
    CONFIG.enabled_channels.CHATBOT = true
  })
})
