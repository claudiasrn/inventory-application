const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS item_suppliers;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS suppliers;

CREATE TABLE categories (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE suppliers (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  contact_email TEXT,
  country TEXT
);

CREATE TABLE items (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE item_suppliers (
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  wholesale_price NUMERIC(10,2) CHECK (wholesale_price >= 0),
  PRIMARY KEY (item_id, supplier_id)
);

INSERT INTO categories (name, description) VALUES
  ('Freshwater fish', 'Community and species tanks'),
  ('Live plants', 'Rooted, floating and moss'),
  ('Equipment', 'Filters, heaters, lighting'),
  ('Fish food', 'Flakes, pellets and frozen'),
  ('Invertebrates', 'Shrimp, snails and crabs');

INSERT INTO suppliers (name, contact_email, country) VALUES
  ('Aquaflora BV', 'orders@aquaflora.nl', 'Netherlands'),
  ('Tropica Aquarium Plants', 'sales@tropica.dk', 'Denmark'),
  ('Rheintal Zoobedarf', 'info@rheintal-zoo.de', 'Germany'),
  ('Nordic Aqua Supply', NULL, 'Sweden');

INSERT INTO items (name, description, price, stock, category_id) VALUES
  ('Neon tetra', 'Small schooling fish. Keep in groups of six or more.', 2.80, 64, (SELECT id FROM categories WHERE name = 'Freshwater fish')),
  ('Cardinal tetra', 'Similar to the neon but with fuller red.', 3.40, 41, (SELECT id FROM categories WHERE name = 'Freshwater fish')),
  ('Corydoras panda', 'Bottom-dwelling catfish. Needs soft substrate.', 5.90, 18, (SELECT id FROM categories WHERE name = 'Freshwater fish')),
  ('Betta splendens', 'Male. House alone or with peaceful tankmates.', 12.00, 7, (SELECT id FROM categories WHERE name = 'Freshwater fish')),
  ('Guppy', 'Hardy livebearer. Breeds readily.', 3.20, 52, (SELECT id FROM categories WHERE name = 'Freshwater fish')),
  ('Java fern', 'Slow-growing rhizome plant. Attaches to wood or stone.', 6.50, 32, (SELECT id FROM categories WHERE name = 'Live plants')),
  ('Anubias nana', 'Low-light rhizome plant. Do not bury the rhizome.', 8.00, 17, (SELECT id FROM categories WHERE name = 'Live plants')),
  ('Christmas moss', 'Dense moss for carpeting or attaching to wood.', 4.25, 3, (SELECT id FROM categories WHERE name = 'Live plants')),
  ('Amazon sword', 'Large background plant. Root-feeder.', 7.80, 14, (SELECT id FROM categories WHERE name = 'Live plants')),
  ('Vallisneria', 'Fast-growing background grass.', 4.50, 26, (SELECT id FROM categories WHERE name = 'Live plants')),
  ('Eheim 2213 filter', 'External canister filter for tanks up to 250L.', 89.00, 2, (SELECT id FROM categories WHERE name = 'Equipment')),
  ('Heater 100W', 'Adjustable submersible heater.', 24.50, 11, (SELECT id FROM categories WHERE name = 'Equipment')),
  ('LED light bar 60cm', 'Full-spectrum planted tank lighting.', 65.00, 6, (SELECT id FROM categories WHERE name = 'Equipment')),
  ('CO2 diffuser', 'Ceramic disc diffuser for planted tanks.', 18.90, 4, (SELECT id FROM categories WHERE name = 'Equipment')),
  ('Air pump', 'Twin outlet, quiet running.', 21.00, 9, (SELECT id FROM categories WHERE name = 'Equipment')),
  ('Flake food 250ml', 'Staple flake for tropical community fish.', 8.40, 38, (SELECT id FROM categories WHERE name = 'Fish food')),
  ('Sinking pellets', 'For bottom feeders and catfish.', 9.10, 22, (SELECT id FROM categories WHERE name = 'Fish food')),
  ('Frozen bloodworm', 'Blister pack, 100g.', 5.60, 30, (SELECT id FROM categories WHERE name = 'Fish food')),
  ('Amano shrimp', 'Algae eater. Keep in groups.', 4.80, 45, (SELECT id FROM categories WHERE name = 'Invertebrates')),
  ('Cherry shrimp', 'Colourful dwarf shrimp. Breeds in freshwater.', 3.60, 60, (SELECT id FROM categories WHERE name = 'Invertebrates')),
  ('Nerite snail', 'Algae grazer. Will not breed in freshwater.', 4.20, 1, (SELECT id FROM categories WHERE name = 'Invertebrates'));

INSERT INTO item_suppliers (item_id, supplier_id, wholesale_price) VALUES
  ((SELECT id FROM items WHERE name = 'Java fern'), (SELECT id FROM suppliers WHERE name = 'Aquaflora BV'), 3.10),
  ((SELECT id FROM items WHERE name = 'Java fern'), (SELECT id FROM suppliers WHERE name = 'Tropica Aquarium Plants'), 3.45),
  ((SELECT id FROM items WHERE name = 'Anubias nana'), (SELECT id FROM suppliers WHERE name = 'Aquaflora BV'), 4.20),
  ((SELECT id FROM items WHERE name = 'Anubias nana'), (SELECT id FROM suppliers WHERE name = 'Tropica Aquarium Plants'), 4.05),
  ((SELECT id FROM items WHERE name = 'Christmas moss'), (SELECT id FROM suppliers WHERE name = 'Tropica Aquarium Plants'), 2.10),
  ((SELECT id FROM items WHERE name = 'Amazon sword'), (SELECT id FROM suppliers WHERE name = 'Aquaflora BV'), 3.90),
  ((SELECT id FROM items WHERE name = 'Vallisneria'), (SELECT id FROM suppliers WHERE name = 'Aquaflora BV'), 2.25),
  ((SELECT id FROM items WHERE name = 'Neon tetra'), (SELECT id FROM suppliers WHERE name = 'Nordic Aqua Supply'), 1.30),
  ((SELECT id FROM items WHERE name = 'Cardinal tetra'), (SELECT id FROM suppliers WHERE name = 'Nordic Aqua Supply'), 1.70),
  ((SELECT id FROM items WHERE name = 'Corydoras panda'), (SELECT id FROM suppliers WHERE name = 'Nordic Aqua Supply'), 2.95),
  ((SELECT id FROM items WHERE name = 'Guppy'), (SELECT id FROM suppliers WHERE name = 'Nordic Aqua Supply'), 1.55),
  ((SELECT id FROM items WHERE name = 'Betta splendens'), (SELECT id FROM suppliers WHERE name = 'Rheintal Zoobedarf'), 6.40),
  ((SELECT id FROM items WHERE name = 'Eheim 2213 filter'), (SELECT id FROM suppliers WHERE name = 'Rheintal Zoobedarf'), 61.00),
  ((SELECT id FROM items WHERE name = 'Heater 100W'), (SELECT id FROM suppliers WHERE name = 'Rheintal Zoobedarf'), 15.80),
  ((SELECT id FROM items WHERE name = 'LED light bar 60cm'), (SELECT id FROM suppliers WHERE name = 'Rheintal Zoobedarf'), 44.00),
  ((SELECT id FROM items WHERE name = 'CO2 diffuser'), (SELECT id FROM suppliers WHERE name = 'Aquaflora BV'), 11.20),
  ((SELECT id FROM items WHERE name = 'Air pump'), (SELECT id FROM suppliers WHERE name = 'Rheintal Zoobedarf'), 13.50),
  ((SELECT id FROM items WHERE name = 'Flake food 250ml'), (SELECT id FROM suppliers WHERE name = 'Rheintal Zoobedarf'), 4.90),
  ((SELECT id FROM items WHERE name = 'Sinking pellets'), (SELECT id FROM suppliers WHERE name = 'Rheintal Zoobedarf'), 5.40),
  ((SELECT id FROM items WHERE name = 'Frozen bloodworm'), (SELECT id FROM suppliers WHERE name = 'Nordic Aqua Supply'), 3.15),
  ((SELECT id FROM items WHERE name = 'Amano shrimp'), (SELECT id FROM suppliers WHERE name = 'Nordic Aqua Supply'), 2.40),
  ((SELECT id FROM items WHERE name = 'Cherry shrimp'), (SELECT id FROM suppliers WHERE name = 'Nordic Aqua Supply'), 1.80),
  ((SELECT id FROM items WHERE name = 'Nerite snail'), (SELECT id FROM suppliers WHERE name = 'Aquaflora BV'), 2.05);
`;

async function main() {
	console.log("seeding...");
	const client = new Client({ connectionString: process.env.DATABASE_URL });
	await client.connect();
	await client.query(SQL);
	await client.end();
	console.log("done");
}

main();