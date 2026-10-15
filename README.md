# ToolShare

ToolShare is a neighborhood tool library. Browse equipment shared by nearby residents, check the estimated rental cost, and send a borrowing request with the dates you need it.

## Run the app

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## What works today

- Search listings by name, category, description, and neighborhood.
- Filter the catalog by tool category.
- Request a tool for a pickup and return date, with an optional note to the lender.
- See the estimated rental total and manage requests from the **My requests** view.

The catalog is sample data, and requests are saved in this browser's local storage. There are no accounts or shared server yet, so a request is not sent to a real lender. Those are planned as later steps.

## Built with

React, Vite, JavaScript, and CSS. The frontend follows a component-per-folder layout, with each component's styles beside it.