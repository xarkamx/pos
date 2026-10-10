# Repository map

Last mapped: 2026-09-27. Paths are relative to the repository root and preserve source casing.
Purpose: read this first, then open only the relevant feature files. This is a navigation index, not an API specification or a claim that every feature works.

Cross-project architecture (reviewed 2026-09-30): [../projects_overview.md](../projects_overview.md). POS calls sibling BOS, whose `src/services/users/basService.ts` delegates identity operations to sibling BAS; [BAS map](../bas/rep_map.md). BAS returns token expiry in Unix seconds, BOS forwards it, and POS authContext treats the numeric value as milliseconds: a source-confirmed integration mismatch, not fixed here.

## Start here

- Public invoice download policy (2026-10-10): orders with payment_type 99 can download linked documents before payment, without provider metadata filtering. Pending type-99 orders without invoices issue PPD/form 99 after fiscal validation and a durable claim. Other forms require paid status. PublicOrderInvoicesPage explains this; no transport changes.

- Public invoicing: `/facturas/:uuid` -> `src/pages/PublicOrderInvoicesPage.js`. No login/dashboard wrapper. Reads BOS GET `/public/orders/:uuid` to display order status and customer name/RFC/postal code/tax system; only an explicit button click calls `/public/orders/:uuid/invoices.zip` (may issue). `publicOrderTransaction.js` omits credentials/Authorization, validates UUID v4, disables cache/referrer, handles JSON errors and downloads ZIP through an object URL. No React Query polling/retries of issuance. Loading/error/retry/download states; noindex and no-referrer metadata. Page/transport tests mock BOS. BOS must deploy its public details endpoint before this page is used.
- Public invoice verification: all 10 POS tests passed (3 suites), production build succeeded, new page/transport ESLint passed. BOS typecheck and 37 public-order tests passed. No real invoices were issued or deployment performed; production build reports existing large-bundle/outdated Browserslist notices.

| Task | First files to open |
| --- | --- |
| Startup/providers/query defaults | `src/index.js`, `src/App.js` |
| Routes, roles, landing pages, menu entries | `src/routes.js`, `src/layouts/dashboard/nav/index.js`, `src/hooks/useNav.js` |
| Login/session/API authorization | `src/sections/auth/login/LoginForm.js`, `src/context/authContext.js`, `src/utils/transactions/transactionService.js` |
| Checkout/cart/drafts/printing | `src/pages/CheckoutPage.js`, `src/hooks/useCheckout.js`, `src/hooks/useRequestedOrders.js` |
| Orders/payments/invoices | Feature tables below; billing also lives in `src/utils/transactions/orderTransaction.js` |
| API URL/build setup | `package.json`, `console/envToJson.js`, `src/config/index.js` |
| Shared tables/forms/dialogs | `src/components/tables/Table.js`, `src/components/Containers/QuickFormContainer.js`, `src/context/PopUpContext.js` |
| Appearance | `src/theme/index.js`, `src/theme/palette.js`, `src/theme/overrides/`, component-local styles |

## Project and filesystem boundaries

- Package: `@pos/pos-web`, version `1.0.0`; browser POS/admin/customer application with predominantly Spanish UI.
- JavaScript/JSX, React 18, Create React App (`react-scripts` 5), React Router 6, React Query 3, MUI 5/Emotion. Versions here are package manifest ranges, not a lockfile audit.
- Other notable dependencies: AJV/ajv-errors, react-hook-form, react-to-print, ApexCharts and MUI X Charts, Firebase 9, date-fns, numeral, lodash.
- This repository contains the frontend. BOS API implementation, database models/migrations, and server authorization are external.

```text
AGENTS.md                   Instructions to read and maintain this map
rep_map.md                  This navigation index
package.json / yarn.lock    Scripts, dependencies, locked dependency graph
README.md                   Spanish feature checklist (not setup documentation)
CHANGELOG.md / LICENSE.md   Existing history/license documents
console/envToJson.js        Generate browser configuration from environment
public/                    HTML shell, manifest, assets, SPA redirect, Firebase worker
src/index.js / App.js       Mount and provider composition
src/routes.js              Route tree, role filtering, page title wrappers
src/pages/                 Route screens; some feature hooks/components colocated
src/sections/auth/          Login and customer activation forms
src/sections/@dashboard/    Feature tables/forms/charts/tickets
src/hooks/                 Shared state, domain queries/mutations, navigation
src/utils/transactions/    BOS endpoint wrappers and shared HTTP transport
src/context/               Authentication, URL filters, popup state
src/components/            Reusable UI and local CSS/SCSS
src/config/                API base URL and SAT tax/payment catalogs
src/core/                  General helpers and older utility classes
src/theme/                 MUI theme, typography, shadows, component overrides
src/errors/ErrorObj.js      API error wrapper
src/_mock/                 Template/mock data (some still imported)
src/firebase.js            Firebase messaging setup/helpers; no src consumer found
build/ / node_modules/     Generated output/dependencies; exclude from mapping
```

`.env` and generated `src/env.json` are ignored. Both existed locally during mapping; their values are deliberately not reproduced. `build/` and `node_modules/` also existed locally. `.vscode/` is editor configuration, not application logic.

## Startup and shared data flow

1. `public/index.html` supplies the root element; `src/index.js` mounts `App`, unregisters the CRA service worker, and invokes `reportWebVitals` without a reporting callback.
2. `src/App.js` nests HelmetProvider -> AuthProvider -> BrowserRouter -> UrlQueryProvider -> PopUpContextProvider -> ThemeProvider -> QueryClientProvider -> Router. ScrollToTop and StyledChart are inside the theme. ReactQueryDevtools is rendered with `initialIsOpen`.
3. QueryClient sets `defaultOptions.queries.refetchInterval` to 20,000 ms. `refetchOnWindowFocus: false` is placed beside `queries`, not inside it; do not assume focus refetch is disabled without checking behavior.
4. Typical feature flow: page -> domain hook or page-local query -> transaction class -> `TransactionService` -> configured BOS API. Many mutations call the owning query's `refetch()` directly; no centralized cache invalidation layer was found.
5. `TransactionService` implements GET/query serialization, POST, PUT, DELETE and blob download (`file`). It adds a Bearer token from parsed `localStorage.accessToken.jwt`. JSON HTTP errors with status >=400 become `ErrorObj`; successful normal requests are parsed as JSON. Consumers use varying response shapes, including `.data`, so check each endpoint's callers.
6. `src/context/PopUpContext.js` exports `usePopUp()` / `popUpAlert(status, message, onAccept)`. `DashboardLayout.js` renders the shared StatusModal. Login and customer credentials pages also render popup state.
7. `src/context/queryContext.js` and `src/hooks/useQueryParams.js` maintain filters in state and synchronize query strings with `history.replaceState`. `src/hooks/useHooks.js` supplies `useCState` (merged object state), history/query-string helpers, and mount effects.

## Authentication, routes, and navigation

- Login: `src/pages/LoginPage.js` -> `src/sections/auth/login/LoginForm.js` -> `LoginTransaction.login()` -> POST `/auth`.
- `src/context/authContext.js` reads/writes `localStorage.accessToken`, exposes access/setAccess/logOut, and checks the access object's `ttl`. `src/hooks/useAuth.js` accesses this context.
- `src/routes.js` exports `routes` and `filterRoutes`. Role names: `admin`, `cashier`, `storer`, `middleman`, `customer`, plus `master` bypass in `filterRoutes`.
- `filterRoutes` mutates route objects while filtering and wrapping titles. Duplicate route paths select different customer/staff screens. Preserve this distinction when editing routes; master bypass and menu filtering differ.
- Root landing destination uses the first role: admin/master -> `/dashboard/app`; cashier/storer -> `/dashboard/caja`; middleman -> `/dashboard/comisionistas/me`; customer -> `/dashboard/me`. Unauthenticated root -> `/login`.
- Active sidebar: `src/layouts/dashboard/nav/index.js` derives entries from titled children in `routes[0]`, filters roles, sorts titles, and selects menu depth. `nav/config.js` is an older static list, not the active sidebar source.
- `src/layouts/dashboard/header/Searchbar.js` also searches route metadata. `src/hooks/useNav.js` validates navigation against flattened, role-filtered routes.

All paths below are under `/dashboard/` unless marked public. Role shorthand: A=admin, C=cashier, S=storer, M=middleman, U=customer. `master` bypass applies separately.

| Path | Component/source under `src/pages/` | Roles |
| --- | --- | --- |
| `app` | `DashboardAppPage.js` | A,C,S |
| `clientes`; `clientes/:clientId` | `ClientsPage.js`; `clients/client.js` | A,C |
| `clientes/:clientId/factura` | `clients/billing/index.js` | A,C |
| `ordenes`; `ordenes/:orderId` | `OrdersLists.js`; `OrderPage.js` | A,C,S list; A,C detail |
| `ordenes`; `ordenes/:orderId` | `clients/orders/myOrders.js`; `clients/orders/clientOrderPage.js` | U |
| `pagos` | `PaymentsPage.js` | A,C |
| `productos`; `productos/:productId`; `procesos` | `ProductsPage.js`; `products/SingleProduct.js`; `products/ProductProcess.js` | A,C,S |
| `caja`; `caja/historial` | `CheckoutPage.js`; `checkout/CheckoutHistory.js` | A,C,S |
| `caja` | `clients/checkout/index.js` | U |
| `comisionista/caja` | `checkout/MiddlemanCheckout.js` | M |
| `inventario` | `Inventory/index.js` | A,S |
| `inventario/materiales` | `materials/components/materialInventory.js` | A,S |
| `inventario/insumos`; `insumos/:materialId` | `materials/index.js` (`MaterialsPage`, `MaterialOverview`) | A,S |
| `comisionistas` | `middleman/middlemanPage.js` | A |
| `comisionistas/me`; `comisionistas/me/productos` | `middleman/SingleMiddleman.js`; `middleman/MiddlemanProducts.js` | M |
| `Nomina` | `payroll/payrollPage.js` | A,C |
| `empleados/:employeeId`; `empleados/:employeeId/pto` | `employees/employeeView.js`; `employees/pto/ptoView.js` | A |
| `usuarios` | `users/index.js` | A |
| `me` | `users/me.js` / `clients/details.js` | A,C,S,M / U |
| `facturas`; `facturas/recibidas` | `billing/emited.js` (`BillingList`, `ReceivedBillingList`) | A,C |
| `facturas/:billingId/ordenes` | `billing/billedOrders.js` | A,C |
| `facturas/custom` | `billing/customBillForm.js` | A,C |
| Public `/login`; `/client/register` | `LoginPage.js`; `clientCredentials.js` | Public |
| Public `/404`, wildcard redirects | `Page404.js`, `src/layouts/simple/SimpleLayout.js` | Public |

## Feature implementation map

In this table, hook paths are under `src/`; transaction filenames are under `src/utils/transactions/`. API paths are client-side endpoint references, not verified server contracts.

| Feature | Logic and UI collaborators | Transaction / endpoint families |
| --- | --- | --- |
| Checkout | `hooks/useCheckout.js` manages items/quantity/discount/totals; `hooks/useRequestedOrders.js` exports `useCheckoutOrder`; `sections/@dashboard/checkout/{itemsList,paymentForm}.js`; product/client selectors | `orderTransaction.js`: POST `/orders`; requested order list `/requested`, request `/orders/request` |
| Order list/detail | `hooks/useOrders.js` (`useOrders`, `useOrder`); `pages/PendingOrders.js`; `sections/@dashboard/orders/OrdersTable.js`, `paymentModal.js` | `orderTransaction.js`: `/orders`, `/orders/:id`, `/orders/:id/payment`, `/orders/:id/payments` |
| Payments | `hooks/usePayments.js`; `sections/@dashboard/payments/` has table, summary, quick form, payment method selector; `sections/@dashboard/charts/paymentCharts.js` | `paymentsTransaction.js`: `/payments`; order payment operations remain in `orderTransaction.js` |
| Clients/debt | `hooks/useClients.js` (`useClients`, `useClient`, `useMiddlemanClients`); `sections/@dashboard/clients/` forms/table/selectors | `clientsTransaction.js`: `/clients`, client resume/payments/debt, `/clients/me`, `/clients/me/resume` |
| Customer portal | `pages/clients/details.js`, `pages/clients/orders/`, `pages/clients/checkout/`; queries also live inside page files | `clientsTransaction.js`, `orderTransaction.js`: `/clients/me/orders`, `/clients/me/orders/:id`, `/orders/request` |
| Products/processes | `hooks/useProducts.js`; local queries in `pages/products/{SingleProduct,ProductProcess}.js`; `sections/@dashboard/products/` | `productsTransaction.js`: `/products`, `/process`, `/products/inventory`, product info/materials, `/inventory/history/:id` |
| Product inventory | `pages/Inventory/hooks/useInventory.js` (`useInventory`, `usePublicInventory`); `pages/Inventory/components/` | `inventoryTransaction.js`: `/inventory`; main inventory list is read via `ProductsTransaction.getProductInventoryList()` |
| Materials/recipes | `pages/materials/hooks/useMaterial.js` (`useMaterial`, `useMaterialProducts`, `useProductsRecipe`); form/selector/inventory components in that feature | `materialTransaction.js`: `/materials`, `/materials/:id/products`, `/inventory/materials`; product recipes also use `productsTransaction.js` |
| Billing | `hooks/useBilling.js`; `pages/clients/billing/index.js`; `pages/orders/billingButton.js`; `sections/@dashboard/billing/` download/complement components | Most operations in `orderTransaction.js`: `/billing`, cancellation, download/send, `/billing/complement`, `/billing/metadata`, `/orders/bill/:id`. `billingTransaction.js` only handles `/billing/custom` |
| Commission agents | Page-local queries in `pages/middleman/`; `pages/checkout/MiddlemanCheckout.js`; `hooks/useClients.js` | `middlemanTransaction.js`: `/middleman`, agent orders/paid, `/middleman/me/clients`, `/middleman/me/payments` |
| Users/credentials | `hooks/useUsers.js`; `sections/@dashboard/users/`; `pages/users/me.js`; `sections/auth/login/ClientActivationForm.js` | `usersTransaction.js`: `/users`, `/users/me/password`, `/clients/credentials` |
| Payroll/employees/PTO | `pages/payroll/` has page/form/table; `pages/employees/hooks/{useEmployee,usePTO}.js`, `pages/employees/pto/` | `payrollTransaction.js`: `/payroll`, `/payroll/pay`, employee creation via `/employees`; `employeeTransaction.js`: employee CRUD/info/PTO and `/employees/pto/:id` |
| Dashboard statistics/SIAPA | `hooks/useStats.js`, `sections/@dashboard/app/`, `sections/@dashboard/siapa/SiapaCards.js` | `infoTransaction.js`: `/info`, `/info/debtors`, `/info/products`, `/inventory/items/:id`; `SiapaTransaction.js`: `/info/siapa` |

## Checkout persistence and print output

- Ticket invoice QR: `sections/@dashboard/orders/InvoiceQr.js` uses local `qrcode.react` SVG generation with a four-module quiet zone and 42mm black/white print size. Appended to `Ticket.js` only for valid UUID v4; links to the current POS origin + `/facturas/:uuid` (no invoice issuance on render). `OrderPage.PrintTicket` passes `order.publicUuid`; checkout carries creation response `data.publicUuid` through `useCheckoutOrder` -> `useCheckout` -> `CheckoutPage`, resetting it on clear/new creation. Historical orders without UUID show no QR. Print from the public POS domain so the encoded origin is reachable by customers.
- QR verification: 16 tests passed across 4 suites, including SVG payload/quiet zone, missing UUID and placement at ticket end. Production build succeeded and InvoiceQr ESLint passed. Physical printer/scanner verification remains untested.

- Order invoice table (2026-10-05): `sections/@dashboard/billing/OrderInvoicesTable.js` is rendered in the existing `pages/OrderPage.js` (`/dashboard/ordenes/:orderId`). Query key `['orderInvoices', orderId]` calls `OrderTransaction.getBillsByOrder` -> existing BOS GET `/orders/:orderId/billing` (raw billing rows, including linked invoices). Columns: folio, created_at, type, recorded status, download. Downloads use `external_id`, not the internal row `id`; empty/loading/error states are explicit. `DownloadBillButton` handles pending/failure state; `TransactionService.file` checks HTTP success and downloads a named ZIP via a temporary anchor without navigating away. These consume existing BOS contracts; no backend changes.

- `CheckoutPage.js` saves nonempty carts under `localStorage` keys `checkout-<timestamp>` and restores via URL `localId`. Stored values include products, totals, discount, clientId, payment.
- `pages/checkout/CheckoutHistory.js` lists those local entries, reopens a draft with `localId`, and removes entries. This is local draft history, distinct from server order history.
- `useCheckout.send()` maps cart lines to `{ productId, quantity }`, with clientId, discount, partialPayment, paymentType. `useCheckoutOrder` reads the created ID from response `.data.orderId`.
- Receipt components: `sections/@dashboard/orders/Ticket.js`, `sTicket.js`, `paymentTicket.js`, `onGoingTicket.js`; `OrderPage.js` also exports `PrintTicket`. Printing uses react-to-print. Catalog printing is in `sections/@dashboard/prints/catalog.js`.

## Shared UI and utility ownership

- `components/tables/Table.js`: `CustomTable`, `ResponsiveList`, `ResponsiveListItem`; `paginatedTable.js`: `PaginatedTable`; table styles in `components/tables/scss/`.
- `components/Containers/`: QuickFormContainer/Input/Button, editableContainer, SmartGrid, SplashScreen, shared container styles. `components/Inputs/`: debounce/search-date controls.
- `components/CustomModal/`: StatusModal and ConfirmModal. `components/FilterWall/ConditionalWall.js`: conditional rendering helper.
- `components/Formats/`, `utils/formatNumber.js`, `utils/formatTime.js`, `utils/formats.js`: display formatting. `core/helpers.js`: money/date helpers, serialization, tax reversal, miscellaneous calculations.
- `hooks/useValidate.js`: AJV schema validation with ajv-errors; schemas are supplied by callers. `config/constants.js`: SAT tax systems, payment types, CFDI uses. `utils/translations/translations.js`: translation resource.
- `theme/`: theme construction, globalStyles, palette, typography, shadows, MUI overrides. `components/chart/`: chart styles/options. Remaining lowercase UI folders supply icons, logos, scrollbar, navigation, labels, and color controls.
- `core/README.md` describes an older Ajax helper. Current domain transactions use `TransactionService`, not that documented Ajax entry point.

## Configuration and commands

Run from repository root. Yarn lockfile is present; no Node engine or packageManager pin is declared in `package.json`.

| Command | Defined behavior |
| --- | --- |
| `yarn install` | Install manifest/lockfile dependencies |
| `yarn envJson` | Run `console/envToJson.js`: dotenv + environment keys containing `REACT_` -> ignored `src/env.json` |
| `yarn dev` | CRA development server; does **not** generate env.json first |
| `yarn build` | Generate env.json, then CRA production build into `build/` |
| `yarn test --watchAll=false` | CRA test runner in non-watch mode; invoice request/download tests in `src/utils/transactions/orderTransaction.test.js` |
| `yarn lint` | ESLint over src JS/JSX |
| `yarn lint:fix` | Mutating ESLint autofix |

`src/config/index.js` reads `env.REACT_BOS_API_URL` into `config.apis.bos`. For a fresh checkout, configure that environment variable and run `yarn envJson` before `yarn dev`. Generated configuration is bundled into the client; keep private credentials out of it.

`package.json` also has `eject`, `clear-all`, `re-start`, `re-build`. Cleanup scripts use Unix `rm -rf`; `re-start` references missing `yarn start`. They are not the normal Windows startup instructions.

- `.eslintrc`: Airbnb + jsx-a11y + React Hooks + Prettier; ignores `src/core/*.js`, with extensive rule overrides.
- `.prettierrc`: 120-column width, single quotes, 2 spaces, ES5 trailing commas.
- `jsconfig.json`: root baseUrl, src include, node_modules exclude. Source mixes ES module imports and require calls.
- `public/_redirects` rewrites all paths to `/index.html` for SPA hosting. Configure equivalent fallback on other hosts.
- `public/manifest.json`, `public/env.js`, and `public/assets/` are browser resources. Firebase's separate messaging worker is `public/firebase-messaging-sw.js`; CRA service-worker unregistration should not be confused with Firebase configuration.

## Findings that prevent wrong turns

- `pages/UserPage.js` and `pages/BlogPage.js` are template/mock screens absent from the current route table. Active users screen is `pages/users/index.js`. Mock account data is still imported by header AccountPopover.
- Received invoice route uses `ReceivedBillingList` from `pages/billing/emited.js`, not `pages/billing/recived.js`.
- `hooks/useCrud.js` is empty; do not look there for a shared CRUD abstraction.
- Query keys are not consistently parameterized: e.g. `useOrders` uses `orders` despite query arguments; product detail history and main inventory both use `inventory`. Inspect key users before changing cache behavior.
- `useRequestedOrders.js` contains `addRequestedOrder` calling `createRequest`, which is absent from `OrderTransaction`; its available request method is `requestOrder`. Treat this as an observed mismatch, not an established working path.
- `useCheckout.js` has a nonpositive/invalid quantity branch calling `onDeleteFn(id)` without its callback/products arguments. This is an observed code issue, not fixed by the mapping task.
- Firebase helper source exists but repository src searches found no import of it; do not assume notifications are wired into startup.
- `src/utils/transactions/orderTransaction.test.js` covers authenticated order-invoice lookup, ZIP download using external ID, URL cleanup, and HTTP download failure (3 tests passing, 2026-10-05). Targeted ESLint passed; production build passed with existing loginTransaction console/bundle-size/Browserslist warnings. No CI YAML was found in the initial mapping. Live backend/download behavior has not been verified.

## Maintenance and narrow searches

`AGENTS.md` makes map-first navigation and map maintenance persistent project instructions. After every change, update only affected entries when needed: added/removed/renamed files, routes/roles, ownership, endpoint families, storage, setup, or verified findings. Remove stale observations when fixed. Keep this a current map rather than a chronological log.

Useful scoped searches:

```powershell
rg -n 'pattern' src/routes.js src/hooks src/utils/transactions
rg -n 'useQuery|useMutation' src/pages/materials src/hooks
rg -n 'symbolName' src
rg --files src/pages src/sections src/hooks
git diff --stat
```

Prefer paths and exported symbols over line numbers, which drift. Exclude `node_modules/`, `build/`, lockfile content, and binary assets from broad indexing. Re-read the relevant source before implementation; update this map with verified facts only.

## Cashier permissions

- Cashier can view order details and generate order/client/custom invoices. useClientPermissions requires admin for editing existing clients; ClientsPage/ClientsTable omit inline edits, SinglePageClient renders ClientReadOnlyDetails, and OrderPage hides customer reassignment. New customer creation and customer self-service retain existing permissions.
- BOS enforces PUT /clients/:id admin access and rejects non-admin clientId changes on PUT /orders/:id. Deploy both projects. ClientPermissions.test.js verifies admin/cashier roles and read-only details/table controls.
- Verification: 7 POS permission/UI tests and 35 BOS order/client/billing tests passed; BOS TypeScript and POS production build passed (existing bundle-size/Browserslist notices). Identity, provider and persistence mocked; no invoices issued.

PPD correction verification (2026-10-10): 46 BOS public-invoice/claim/route tests and 3 POS public-page tests passed; BOS typecheck passed. External provider and database mocked; no real invoices issued or deployment performed.
