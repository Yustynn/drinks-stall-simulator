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

    return `${isIced ? 'Iced ' : ''}${drink}`;
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

  finalize() {
  }

  get totalCustomers() {
    return this.lostCustomers.length + this.joinedCustomers.length;
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

    console.log(`Ending Simulation Clock: ${this.simTime}`);
  }

  processArrival() {
    const { queue, simTime, tracker } = this;
    const { pow, random } = Math;

    const depTime = this.lastDepTime + genExpSeconds(MU);
    const customer = new Customer(this.simTime, depTime);

    const isJoinedQueue = random() > pow(QUEUE_JOIN_WILLINGNESS, queue.length)

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

const res = []
for (let i = 0; i < 1000; i++) {
  const sim = new Simulator()
  sim.run()
  
  res.push(sim.tracker.totalCustomers)
}

console.log( res.reduce((a, b) => a + b, 0) / res.length )
