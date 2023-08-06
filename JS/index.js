// Car Agency Object
const carAgency = {
  agencies: [],
  createAgency(id, name, cash, credit) {
    return { id, name, cash, credit, availableCars: [] };
  },
  addAgency(agency) {
    this.agencies.push(agency);
  },
  findAgencyByNameOrId(searchValue) {
    return this.agencies.find((agency) => agency.name === searchValue || agency.id === searchValue);
  },
  retrieveAllAgenciesNames() {
    return this.agencies.map((agency) => agency.name);
  },
  addCarToAgency(agency, car) {
    agency.availableCars.push(car);
  },
  removeCarFromAgency(agency, carId) {
    agency.availableCars = agency.availableCars.filter((car) => car.id !== carId);
  },
  updateCarPriceInAgency(agency, carId, newPrice) {
    const car = agency.availableCars.find((car) => car.id === carId);
    if (car) {
      car.price = newPrice;
    } else {
      console.log(`Car with ID ${carId} not found in ${agency.name}.`);
    }
  },
  getTotalAgencyRevenue(agency) {
    const totalRevenue = agency.availableCars.reduce((total, car) => total + car.price, 0);
    return totalRevenue;
  },
  transferCarBetweenAgencies(sourceAgency, destinationAgency, carId) {
    const carIndex = sourceAgency.availableCars.findIndex((car) => car.id === carId);
    if (carIndex !== -1) {
      const car = sourceAgency.availableCars[carIndex];
      sourceAgency.availableCars.splice(carIndex, 1);
      destinationAgency.availableCars.push(car);
      console.log(`Car ${car.brand} ${car.model} transferred from ${sourceAgency.name} to ${destinationAgency.name}.`);
    } else {
      console.log(`Car with ID ${carId} not found in ${sourceAgency.name}.`);
    }
  },
  changeAgencyCash(agency, newCashAmount) {
    agency.cash = newCashAmount;
  },
  changeAgencyCredit(agency, newCreditAmount) {
    agency.credit = newCreditAmount;
  },
};

// Customer Object
const customer = {
  customers: [],
  createCustomer(id, name, cash) {
    return { id, name, cash, ownedCars: [] };
  },
  addCustomer(customer) {
    this.customers.push(customer);
  },
  findCustomerByNameOrId(searchValue) {
    return this.customers.find((customer) => customer.name === searchValue || customer.id === searchValue);
  },
  retrieveAllCustomersNames() {
    return this.customers.map((customer) => customer.name);
  },
  changeCustomerCash(customer, newCashAmount) {
    customer.cash = newCashAmount;
  },
  getCustomerTotalCarValue(customer) {
    const totalCarValue = customer.ownedCars.reduce((total, car) => total + car.price, 0);
    return totalCarValue;
  },
};

// Car Object
const car = {
  cars: [],
  createCar(id, brand, model, year, price) {
    return { id, brand, model, year, price };
  },
  addCar(car) {
    this.cars.push(car);
  },
  getAllAvailableCars() {
    const availableCars = [];
    carAgency.agencies.forEach((agency) => {
      agency.availableCars.forEach((car) => {
        availableCars.push(car);
      });
    });
    return availableCars;
  },
};

// Tax Authority Object
const taxAuthority = {
  revenue: 0,
};

// Car Purchase Operations
function sellCar(customer, carId, agencyId) {
  const agency = carAgency.findAgencyByNameOrId(agencyId);
  if (!agency) {
    console.log(`Agency with ID ${agencyId} not found.`);
    return;
  }

  const carIndex = agency.availableCars.findIndex((car) => car.id === carId);
  if (carIndex === -1) {
    console.log(`Car with ID ${carId} not found in ${agency.name}'s inventory.`);
    return;
  }

  const car = agency.availableCars[carIndex];
  if (customer.cash >= car.price) {
    customer.cash -= car.price;
    agency.cash += car.price;
    taxAuthority.revenue += car.price * 0.1; // Assuming a 10% tax rate for simplicity
    agency.availableCars.splice(carIndex, 1);
    customer.ownedCars.push(car);
    console.log(
      `${customer.name} has purchased a ${car.brand} ${car.model} from ${agency.name} for $${car.price}.`
    );
  } else {
    console.log(`${customer.name} does not have enough cash to purchase the car.`);
  }
}

// Utility Function
function getTotalMarketRevenue() {
  const totalRevenue = carAgency.agencies.reduce((total, agency) => total + carAgency.getTotalAgencyRevenue(agency), 0);
  return totalRevenue;
}