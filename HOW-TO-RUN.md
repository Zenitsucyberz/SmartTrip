# SmartTrip — How to Run

SmartTrip is a ride-booking platform with three roles (Admin, Driver, Customer).
It is split into a **server** (Spring Boot REST API + MySQL) and a **client**
(React web app). The server is the only component that talks to the external
web services, so API keys never reach the browser.

## External web services used
- **OpenRouteService** — geocoding, address autocomplete, and driving routes
- **OpenWeatherMap** — destination weather
- **Google Gemini** — AI trip-itinerary generation

## Contents
```
server/                         Spring Boot backend (source)
  smarttrip-0.0.1-SNAPSHOT.jar  <-- compiled, runnable backend
  src/ pom.xml mvnw ...
client/                         React frontend (source)
  dist/                         <-- compiled, ready-to-serve frontend
  src/ package.json ...
```

## Prerequisites
- Java 17+ (`java -version`)
- MySQL running locally on port 3306 with a database named `smarttrip`
  (the app auto-creates the tables on first run)
- Node.js (only needed if you want to rebuild/serve the client with npm)

Database connection is configured in
`server/src/main/resources/application.properties`
(default: user `root`, empty password, `jdbc:mysql://localhost:3306/smarttrip`).

## Run the SERVER (compiled binary)
From the `server/` folder:
```
java -jar smarttrip-0.0.1-SNAPSHOT.jar
```
The API starts on http://localhost:8080

## Run the CLIENT (compiled binary)
The client is a static build in `client/dist/`. Serve it with any static
server. Easiest, from the `client/` folder:
```
npx vite preview --port 4173
```
Then open http://localhost:4173

(Alternatively, serve the `client/dist/` folder with any web server.)

## Rebuild from source (optional)
- Server: from `server/`, run `./mvnw package` → produces the jar in `target/`
- Client: from `client/`, run `npm install` then `npm run build` → produces `dist/`

## Test logins (seeded accounts)
- Admin:    admin@gmail.com    / 1234
- Driver:   driver@gmail.com   / 1234
- Customer: master1@gmail.com  / 1234

New customers can also self-register from the User portal.
