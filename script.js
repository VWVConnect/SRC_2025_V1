const RATES = {
  2025: {
    label: "2025/26",
    start: "2025-04-06",
    end: "2026-04-05",
    weeklyCap: 719
  },
  2026: {
    label: "2026/27",
    start: "2026-04-06",
    end: "2027-04-05",
    weeklyCap: 751
  }
};

let selectedYear = 2026;

const form = document.getElementById("calculatorForm");
const result = document.getElementById("result");
const rateYearLabel = document.getElementById("rateYearLabel");
const rateButtons = document.querySelectorAll(".rate-btn");

const redundancyDate = document.getElementById("redundancyDate");
const age = document.getElementById("age");
const years = document.getElementById("years");
const pay = document.getElementById("pay");

const errorIds = {
  redundancyDate: "redundancyDateError",
  age: "ageError",
  years: "yearsError",
  pay: "payError"
};

function parseLocalDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2
  }).format(value);
}

function getApplicableYear(date) {
  if (date >= parseLocalDate(RATES[2026].start)) return 2026;
  return 2025;
}

function clearErrors() {
  Object.values(errorIds).forEach(id => {
    document.getElementById(id).textContent = "";
  });
  document.querySelectorAll("input").forEach(input => input.removeAttribute("aria-invalid"));
}

function setError(field, message) {
  document.getElementById(errorIds[field]).textContent = message;
  document.getElementById(field).setAttribute("aria-invalid", "true");
}

function validate() {
  clearErrors();
  let valid = true;

  const date = parseLocalDate(redundancyDate.value);
  const ageValue = Number(age.value);
  const yearsValue = Number(years.value);
  const payValue = Number(pay.value);

  if (!date) {
    setError("redundancyDate", "Enter the date you were made redundant.");
    valid = false;
  }

  if (!Number.isInteger(ageValue) || ageValue < 16 || ageValue > 100) {
    setError("age", "Enter an age between 16 and 100.");
    valid = false;
  }

  if (!Number.isInteger(yearsValue) || yearsValue < 0 || yearsValue > 20) {
    setError("years", "Enter full years of service, from 0 to 20.");
    valid = false;
  }

  if (!Number.isFinite(payValue) || payValue < 0) {
    setError("pay", "Enter a valid weekly pay amount.");
    valid = false;
  }

  if (date && date > new Date()) {
    setError("redundancyDate", "The redundancy date cannot be in the future.");
    valid = false;
  }

  if (valid && yearsValue < 2) {
    setError("years", "You normally need at least 2 years of continuous service to qualify for statutory redundancy pay.");
    valid = false;
  }

  return valid;
}

function updateYearUI() {
  rateYearLabel.textContent = RATES[selectedYear].label;
  rateButtons.forEach(button => {
    const active = Number(button.dataset.year) === selectedYear;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function calculate() {
  const date = parseLocalDate(redundancyDate.value);
  const ageValue = Number(age.value);
  const yearsValue = Math.min(Number(years.value), 20);
  const payValue = Number(pay.value);

  const applicableYear = getApplicableYear(date);
  const rate = RATES[applicableYear];
  const weeklyPayUsed = Math.min(payValue, rate.weeklyCap);

  let under22 = 0;
  let age22to40 = 0;
  let age41plus = 0;

  // Each year is valued according to the employee's age in that particular year.
  // For the GOV.UK calculator, age bands are applied by counting backwards
  // from the redundancy date using the completed years of service.
  for (let i = 0; i < yearsValue; i++) {
    const ageAtYearEnd = ageValue - i;
    if (ageAtYearEnd < 22) under22++;
    else if (ageAtYearEnd < 41) age22to40++;
    else age41plus++;
  }

  const halfWeek = under22 * 0.5;
  const fullWeek = age22to40;
  const oneAndHalfWeek = age41plus * 1.5;
  const totalWeeks = halfWeek + fullWeek + oneAndHalfWeek;
  const total = Math.min(totalWeeks * weeklyPayUsed, 30 * rate.weeklyCap);

  document.getElementById("result-heading").textContent = formatMoney(total);
  document.getElementById("resultDate").textContent = formatDate(date);
  document.getElementById("resultYear").textContent = rate.label;
  document.getElementById("resultWeeklyPay").textContent = formatMoney(weeklyPayUsed);
  document.getElementById("resultYears").textContent = String(yearsValue);
  document.getElementById("resultTotal").textContent = formatMoney(total);

  const rows = [];
  if (under22) rows.push(`<div class="breakdown-row"><span>${under22} year${under22 === 1 ? "" : "s"} at ½ week's pay</span><strong>${formatMoney(under22 * 0.5 * weeklyPayUsed)}</strong></div>`);
  if (age22to40) rows.push(`<div class="breakdown-row"><span>${age22to40} year${age22to40 === 1 ? "" : "s"} at 1 week's pay</span><strong>${formatMoney(age22to40 * weeklyPayUsed)}</strong></div>`);
  if (age41plus) rows.push(`<div class="breakdown-row"><span>${age41plus} year${age41plus === 1 ? "" : "s"} at 1½ week's pay</span><strong>${formatMoney(age41plus * 1.5 * weeklyPayUsed)}</strong></div>`);
  document.getElementById("breakdownRows").innerHTML = rows.join("");

  const capNotice = document.getElementById("capNotice");
  if (payValue > rate.weeklyCap) {
    capNotice.textContent = `Your weekly pay exceeds the ${rate.label} statutory cap of ${formatMoney(rate.weeklyCap)}, so the calculation uses ${formatMoney(rate.weeklyCap)}.`;
  } else {
    capNotice.textContent = `The ${rate.label} statutory weekly pay cap is ${formatMoney(rate.weeklyCap)}. Your entered weekly pay is within the cap.`;
  }

  if (selectedYear !== applicableYear) {
    capNotice.textContent += ` The redundancy date falls within ${rate.label}, so those rates have been applied rather than the manually selected year.`;
  }

  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

rateButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedYear = Number(button.dataset.year);
    updateYearUI();

    if (redundancyDate.value) {
      const date = parseLocalDate(redundancyDate.value);
      const applicableYear = getApplicableYear(date);
      if (applicableYear !== selectedYear) {
        // The toggle remains available for rate comparison, but calculation
        // always follows the redundancy date.
      }
    }
  });
});

form.addEventListener("submit", event => {
  event.preventDefault();
  if (validate()) calculate();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  form.reset();
  clearErrors();
  result.classList.add("hidden");
  selectedYear = 2026;
  updateYearUI();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

updateYearUI();
