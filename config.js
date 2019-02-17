const DATE = 'January 1, 2019'
const makeTime = (timeStr) => new Date(`${DATE} ${timeStr}`)

module.exports = {
  'OPENING_TIME': makeTime('08:00:00'),
  'CLOSING_TIME': makeTime('21:00:00'),

  'LAMBDA_PEAK': 80,
  'LAMBDA_NONPEAK': 40,
  MU: 40,

  // Note: I've only allowed hour-level granularity for now
  PEAKS: [
    [makeTime('09:00:00'), makeTime('11:00:00')],
    [makeTime('12:00:00'), makeTime('14:00:00')],
    [makeTime('17:00:00'), makeTime('19:00:00')],
  ],

  'P_KOPI': 0.33,
  'P_TEH': 0.33,
  'P_MILO': 0.33,

  'P_ICED': 0.33,

  'PRICES': {
    'Iced Kopi': 1.30,
    'Iced Teh': 1.30,
    'Iced Milo': 1.80,
    'Hot Kopi': 0.90,
    'Hot Teh': 0.90,
    'Hot Milo': 1.30,
  },

  'QUEUE_JOIN_WILLINGNESS': 0.9,
}
