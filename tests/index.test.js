const rewire = require('rewire')
const util = require('./util')
const HoursConfig = rewire('../lib/index.js')

const CONFIG = {
  enabled_channels: ['CHATBOT', 'WHATSAPP'],
  business_hours: [
    {
      start: 0,
      end: util.weekTimestamp(0, 23, 59)
    }
  ]
}
const CHANNEL = 'CHATBOT'

describe('isWebsiteClosedNow', () => {
  test('returns true outside of hours', () => {
    expect(HoursConfig.isWebsiteClosedNow(CONFIG, CHANNEL, util.dayOfWeek(2))).toBe(true)
  })
})
