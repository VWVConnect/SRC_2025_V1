# Statutory Redundancy Pay Calculator

A lightweight, client-facing statutory redundancy pay calculator using the GOV.UK statutory redundancy formula and the applicable weekly pay limits for 2025/26 and 2026/27.

## Features

- Redundancy date input.
- Age at the redundancy date.
- Full years of service.
- Weekly pay before tax and deductions.
- 2025/26 and 2026/27 rate toggle.
- The redundancy date determines the rates actually used for the calculation.
- Weekly pay automatically capped at the applicable statutory limit.
- Service capped at 20 years.
- Minimum two-year service validation.
- Calculation breakdown showing the age-band treatment.
- Responsive design.
- No dependencies, build tools or frameworks required.

## Current statutory rates

| Financial year | Applicable dates | Weekly pay cap | Maximum statutory redundancy payment |
|---|---|---:|---:|
| 2025/26 | 6 April 2025 to 5 April 2026 | £719 | £21,570 |
| 2026/27 | 6 April 2026 to 5 April 2027 | £751 | £22,530 |

The rates and formula should be reviewed whenever GOV.UK publishes updated statutory limits.

## Formula

For each full year of qualifying service:

- ½ week's pay for each full year under age 22;
- 1 week's pay for each full year aged 22 to 40;
- 1½ weeks' pay for each full year aged 41 or over.

Qualifying service is capped at 20 years.

The weekly pay used in the calculation is capped at the statutory weekly pay limit applicable to the redundancy date.

## Important implementation note

The calculator deliberately treats the redundancy date as authoritative. The year toggle is provided to let users view/select the relevant rate set, but it cannot override the statutory rate determined by the redundancy date.

This reduces the risk of calculating a pre-6 April 2026 redundancy using the later £751 weekly cap.

## Files

- `index.html` – calculator markup.
- `style.css` – responsive visual design and brand styling.
- `script.js` – rates, validation and calculation logic.

## Local testing

No installation is required.

Open `index.html` in a browser.

For a more realistic local web server, use any static server, for example VS Code Live Server.

## Source

GOV.UK:

https://www.gov.uk/calculate-your-redundancy-pay

https://www.gov.uk/redundancy-your-rights/redundancy-pay

The calculator is intended as an estimate and should not be treated as legal advice.
