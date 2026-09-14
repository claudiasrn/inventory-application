# The Glass Garden

An inventory management app for an imaginary aquarium shop.

## What it does

Tracks stock across categories, items and suppliers. Every entity has full CRUD, and items and suppliers are linked many-to-many with a per-pairing wholesale price, so one item can come from several suppliers at different costs.

- Browse stock by category, or see everything at once
- Add, edit and delete categories, items and suppliers
- Link and unlink items to suppliers, recording what each one charges
- Home page shows totals, recently added stock and anything running low
- Server-side validation on every form, with errors shown inline and input preserved
- Destructive actions are gated behind an admin password

## Stack

- **Express 5** — routing and middleware
- **PostgreSQL** with **node-postgres** — no ORM, queries written by hand
- **EJS** — server-rendered views
- **express-validator** — form validation

No build step and no client-side JavaScript. Node's built-in `--env-file` and
`--watch` flags replace dotenv and nodemon.

## Database

Four tables:

| Table | Purpose |
| --- | --- |
| `categories` | Browsing axis. Unique name. |
| `items` | The stock itself: price, quantity, category |
| `suppliers` | Who the stock comes from |
| `item_suppliers` | Join table with `wholesale_price`, keyed on both foreign keys |

Deleting a category with items in it is blocked (`ON DELETE RESTRICT`), the items still exist regardless of how the shop is organised, so the app explains the problem rather than cascading the deletion. Join rows do cascade, since a link to a deleted item means nothing.

## What I learned

- Modelling a many-to-many relationship with a composite primary key, and putting data on the join table itself rather than treating it as a pure link
- Choosing delete behaviour per relationship rather than reaching for `CASCADE`
  everywhere, and handling the constraint violation in the app when a delete is refused
- Catching Postgres error codes (`23001`, `23505`) to turn database constraints
  into readable messages instead of stack traces
- Avoiding N+1 queries, item counts come from a single subquery rather than a
  loop of lookups
- Re-rendering a form with submitted values and error messages, and reusing one
  view for both create and edit