# FoodMart

FoodMart is a meal-ordering and delivery application with an Expo React Native client and an Express API backed by MongoDB. Customers can place and track orders; delivery partners can accept available orders, manage assigned deliveries, and update delivery status.

## Project Structure

- `mobile/` — Expo SDK 57 app, React Native 0.86, TypeScript, Expo Router, and NativeWind.
- `server/` — Express API using MongoDB/Mongoose and JWT authentication.

## Requirements

- Node.js 22.13 or newer for the Expo SDK 57 mobile app.
- npm.
- MongoDB connection string (local MongoDB or MongoDB Atlas).
- Expo Go or an Android/iOS emulator for mobile development. The app also supports web.

## Configure the API

Create `server/.env` with the following values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/foodmart
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRATION=7d
```

`MONGO_URI` and `JWT_SECRET` are required. `PORT` defaults to `5000`; `JWT_EXPIRATION` defaults to `7d`. Keep real secrets in your local environment and never commit them.

Install dependencies and start the API:

```bash
cd server
npm install
npm run dev
```

The health endpoint is `http://localhost:5000/api/health`.

## Configure the Mobile App

Create `mobile/.env` and set the API URL to the address reachable from the device running the app:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api
```

Use `10.0.2.2` for the standard Android emulator to reach the host machine. For a physical device, use the computer's LAN IP address, for example `http://192.168.1.20:5000/api`. For an iOS simulator, `http://localhost:5000/api` is typically reachable. Ensure the device and computer can communicate and that the API port is allowed through the firewall.

The client fallback URL currently points to `http://10.0.2.2:8000/api`, so configure `EXPO_PUBLIC_API_URL` if the API is running on its default port (`5000`) or on another host.

Install dependencies and run the app:

```bash
cd mobile
npm install
npx expo start
```

Use the Expo CLI prompts to open the app on a simulator, emulator, or device. To run on web:

```bash
npm run web
```

## Delivery Partner Account

To create or update the delivery partner account from the server environment, set these optional seed values in `server/.env`:

```env
DELIVERY_EMAIL=delivery@example.com
DELIVERY_PASSWORD=replace-with-a-secure-password
DELIVERY_NAME=FoodMart Delivery Partner
```

Then run:

```bash
cd server
npm run seed:delivery
```

`DELIVERY_EMAIL` and `DELIVERY_PASSWORD` are required by the seed script; `DELIVERY_NAME` defaults to `FoodMart Delivery Partner`. The password must contain at least six characters. Treat seeded credentials as secrets.

## Main Workflows

### Customer

- Register or sign in.
- Create an order with an item, quantity, delivery address, urgency, temperature preference, and notes.
- View personal orders and their status.
- View and update profile/contact details.

### Delivery partner

- Sign in with a delivery account.
- View orders available for delivery and accept one.
- View assigned active and completed deliveries, including item, customer, destination, contact details, notes, and status timestamps when available.
- Progress an accepted delivery to `out_for_delivery`, then to `delivered`.
- View and update profile/contact details.

## API Routes

All routes are under `/api`.

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | API health check |
| `POST` | `/auth/register` | Public | Register a customer account |
| `POST` | `/auth/login` | Public | Sign in |
| `GET` | `/users/profile` | Authenticated | Get the current profile |
| `PUT` | `/users/profile` | Authenticated | Update profile details |
| `POST` | `/orders` | Customer | Create an order |
| `GET` | `/orders/my-orders` | Customer | List the current customer's orders |
| `GET` | `/orders/available` | Delivery partner | List orders available for acceptance |
| `PATCH` | `/orders/:id/accept` | Delivery partner | Accept an available order |
| `GET` | `/orders/deliveries` | Delivery partner | List assigned, active, and completed deliveries |
| `PATCH` | `/orders/:id/status` | Delivery partner | Advance an assigned delivery status |

Authenticated endpoints expect `Authorization: Bearer <token>`. Delivery status changes are validated by the API, and order status timestamps are stored in the order's history.

## Checks

Run the mobile TypeScript check and linter:

```bash
cd mobile
npx tsc --noEmit
npm run lint
```

The server currently has no automated test suite configured. Its package script `npm test` is a placeholder.
