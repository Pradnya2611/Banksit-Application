"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2023-04-05T13:15:33.000Z",
    "2023-11-30T09:48:16.000Z",
    "2023-12-25T06:47:33.000Z",
    "2024-01-25T14:43:37.000Z",
    "2024-02-05T16:33:06.000Z",
    "2024-03-31T14:43:26.000Z",
    "2024-04-04T18:49:59.000Z",
    "2024-04-05T12:01:20.000Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2023-04-04T13:15:33.000Z",
    "2023-03-31T09:48:16.000Z",
    "2023-12-25T06:47:33.000Z",
    "2024-01-25T14:43:37.000Z",
    "2024-02-05T16:33:06.000Z",
    "2024-03-31T14:43:26.000Z",
    "2024-04-04T18:49:59.000Z",
    "2024-04-05T12:01:20.000Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account3 = {
  owner: "Pradnya Panchariya",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2023-10-01T13:15:33.000Z",
    "2023-11-30T09:48:16.000Z",
    "2023-12-25T06:47:33.000Z",
    "2024-01-25T14:43:37.000Z",
    "2024-03-30T16:33:06.000Z",
    "2024-03-31T14:43:26.000Z",
    "2024-04-04T18:49:59.000Z",
    "2024-04-05T12:01:20.000Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2023-03-31T13:15:33.000Z",
    "2023-11-30T09:48:16.000Z",
    "2023-12-25T06:47:33.000Z",
    "2024-01-25T14:43:37.000Z",
    "2024-02-05T16:33:06.000Z",
    "2024-03-31T14:43:26.000Z",
    "2024-05-04T18:49:59.000Z",
    "2024-04-05T12:01:20.000Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day} /${month}/${year}`;
  }
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1}${type}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}₹</div>
      </div>
      `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} ₹`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}₹`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}₹`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return (int) => 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}₹`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //     //Display movements
  displayMovements(acc);

  //     //Display balance
  calcDisplayBalance(acc);
  //     //Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//Event handler
let currentAccount, timer;
//currentAccount = account1;
//updateUI(currentAccount);
//containerApp.style.opacity = 100;

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);
labelDate.textContent = `${day} /${month}/${year}, ${hour}:${min}`;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //     //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});
//transfer amount
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);

  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //transfer date
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    //Update UI
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//loan request
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      //add movement
      currentAccount.movements.push(amount);
      //loan date
      currentAccount.movementsDates.push(new Date());
      //updateUI
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

//account close
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputinputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// const eurToINR = 90.26;
// const movementsINR = movements.map(function (mov) {
//   return mov * eurToINR;
// });
// console.log(movements);
// console.log(movementsINR);

// const user = "Pradnya Shirish Panchariya";
// const username = user
//   .toLowerCase()
//   .split(" ")
//   .map((name) => name[0])
//   .join("");

// console.log(username);

// const movements = [5000, 3400, -150, -790, -3210, -1000, 8500, -30];
// const deposit = movements.filter((mov) => mov > 0);
// console.log(movements);
// console.log(deposit);

// const fullname = "Ashwin Pottekkat";
// const fullsplit = fullname.split(" ");

// const firstname = fullsplit[0];
// const lastname = fullsplit[1];

// console.log("first name is " + firstname);
// console.log("last name is " + firstname);
// //console.log(fullsplit);

// const numbers = [10, 20, 30];

// const numbers1 = numbers.reduce((acc, cur) => acc + cur, 10);
// console.log(`Iteration ${i} : ${acc}`);
// console.log(numbers);
// console.log(numbers1);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstWithDrawal = movements.find((mov) => mov < 0);
// console.log(movements);
// console.log(firstWithDrawal);

// const account = accounts.find(
//   (acc) => acc.owner === "Pradnya Shirish Panchariya"
// );
// console.log(account);
//let array2 = [[1, 2, 3], [4, 5, 6], 7, 8];
//console.log(array.flat());

//movements.sort((a, b) => a - b);
//console.log(movements);
