const { addSeconds, isBefore, isWithinInterval } = require('date-fns');

const {
  LAMBDA_PEAK,
  LAMBDA_NONPEAK,
  MU,

  OPENING_TIME,
  CLOSING_TIME,

  P_KOPI,
  P_TEH,
  P_MILO,
  P_ICED,

  PEAKS,

  PRICES,

  QUEUE_JOIN_WILLINGNESS
} = require('./config');


class Customer {
  constructor(arrTime, depTime) {
    this.arrTime = arrTime;
    this.depTime = depTime;
    this.drink = Customer.generateDrink()
  }

  static generateDrink() {
    const isIced = Math.random() < P_ICED;

    let drink;
    const rand = Math.random()

    if (rand < P_KOPI)
      drink = 'Kopi'
    else if (rand < P_KOPI)
      drink = 'Teh'
    else
      drink = 'Milo';

    return `${isIced ? 'Iced' : 'Hot'} ${drink}`;
  }

}

const genExpSeconds = (lambda) => {
  const {exp, random, log} = Math;

  // Using inverse of exp CDF with randgen Y
  const hours = -1/lambda * log(1 - random());

  return hours * 60 * 60;
}


class Tracker {
  constructor() {
    this.joinedCustomers = [];
    this.lostCustomers = [];
  }

  trackJoinedCustomer(customer) {
    this.joinedCustomers.push(customer);
  }

  trackLostCustomer(customer) {
    this.lostCustomers.push(customer);
  }

  computeStatistics() {
    this.lossByHour = {};
    this.joinsByHour = {};
    this.revenueByHour = {};
    this.revenueByDrink = {};

    for (let customer of this.joinedCustomers) {
      const { arrTime, drink } = customer;
      const hour = arrTime.getHours();
      const paid = PRICES[drink];

      if (!this.revenueByDrink.hasOwnProperty(drink)) this.revenueByDrink[drink] = 0;
      if (!this.revenueByHour.hasOwnProperty(hour)) this.revenueByHour[hour] = 0;
      if (!this.joinsByHour.hasOwnProperty(hour)) this.joinsByHour[hour] = 0;

      this.revenueByDrink[drink] += paid;
      this.revenueByHour[hour] += paid;
      this.joinsByHour[hour]++;
    }

    for (let customer of this.lostCustomers) {
      const { arrTime, drink } = customer;
      const hour = arrTime.getHours();
      const loss = PRICES[drink];

      if (!this.lossByHour.hasOwnProperty(hour)) this.lossByHour[hour] = 0;
      this.lossByHour[hour] += loss;
    }

    this.totalRevenue = Object.values(this.revenueByHour)
      .reduce((a, b) => a + b, 0);
    this.totalLoss = Object.values(this.lossByHour)
      .reduce((a, b) => a + b, 0);
  }

  get totalCustomers() {
    return this.lostCustomers.length + this.joinedCustomers.length;
  }

  printStatistics() {
    const {
      joinsByHour,
      lossByHour,
      revenueByDrink,
      revenueByHour,
      totalLoss,
      totalRevenue,
    } = this;

    console.log('\n\nSTATISTICS');
    console.log('Total loss', totalLoss);
    console.log('Total revenue: ', totalRevenue);
    console.log('Revenue by drink: ', revenueByDrink);
    console.log('Revenue by hour: ', revenueByHour);
    console.log('Loss by hour: ', lossByHour);
    console.log('Joins by hour: ', joinsByHour);
  }
}


class Simulator {
  constructor() {
    this.tracker = new Tracker();
    this.queue = [];
    this.simTime = OPENING_TIME;
    this.renewNextArrTime();
  }

  get nextDepTime() {
    if (!this.queue.length) return addSeconds(this.simTime, 9999999999);

    return this.queue[0].depTime;
  }

  get lastDep() {
    if (!this.queue.length) return simTime;

    return this.queue[this.queue.length - 1].depTime;
  }

  renewNextArrTime() {
    const { simTime } = this;

    const isPeak = PEAKS.some( (interval) => isWithinInterval(
      simTime,
      {
        start: interval[0],
        end: interval[1]
      }
    ))

    const secondsDelta = genExpSeconds(isPeak ? LAMBDA_PEAK : LAMBDA_NONPEAK);
    this.nextArrTime = addSeconds(simTime, secondsDelta);
  }

  run() {
    console.log(`Starting Simulation Clock: ${this.simTime}`);

    while (isBefore(this.simTime, CLOSING_TIME)) {
      if (isBefore(this.nextArrTime, this.nextDepTime)) {
        this.simTime = this.nextArrTime;
        this.processArrival();
        this.renewNextArrTime();
      }
      else {
        this.simTime = this.nextDepTime;
        this.processDeparture()
      }
    }

    this.tracker.computeStatistics();
    console.log(`Ending Simulation Clock: ${this.simTime}`);
  }

  processArrival() {
    const { queue, simTime, tracker } = this;
    const { pow, random } = Math;

    const depTime = this.lastDepTime + genExpSeconds(MU);
    const customer = new Customer(this.simTime, depTime);

    const isJoinedQueue = random() < pow(QUEUE_JOIN_WILLINGNESS, queue.length)

    if (isJoinedQueue)
      tracker.trackJoinedCustomer(customer);
    else
      tracker.trackLostCustomer(customer);
    
  }

  processDeparture() {
    this.queue.unshift();
  }
}

const simulator = new Simulator();
simulator.run()
simulator.tracker.printStatistics();
