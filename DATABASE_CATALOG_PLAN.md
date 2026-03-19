# Book Catalog Database Plan

## Why We Need This

Our current book search uses the Google Books API directly at search time. That is useful for prototyping, but it creates product problems:

- search quality is inconsistent
- metadata quality varies by result
- pagination is controlled by Google, not by us
- some books are missing ISBN, image, year, or description
- later purchase-linking becomes unreliable if the selected book record is weak

For a release-ready product, we need to own the searchable catalog instead of depending on raw live API search results.

## Goal

Move from:

- user search -> Google Books API -> show raw results

To:

- Google Books API -> ingest/store books in our database
- our backend -> search/rank/paginate our stored catalog
- frontend -> display our catalog results

Google Books should remain the data source, but our database should become the search catalog.

## High-Level Approach

1. Create a `books` table in our database.
2. Fetch book data from Google Books API.
3. Clean and normalize each book record before saving it.
4. Store/update the records in our database.
5. Make the search endpoint query our database instead of Google directly.
6. Keep Google Books as an ingestion/enrichment source, not as the live search engine.

## What The Database Should Contain

Each book should be stored as one structured record.

Minimum practical fields:

- `id`
- `google_books_id`
- `title`
- `authors`
- `isbn_13`
- `isbn_10`
- `image_url`
- `description`
- `published_date`
- `published_year`
- `categories`
- `language`
- `publisher`
- `page_count`
- `raw_json`
- `created_at`
- `updated_at`

## Why These Fields Matter

- `google_books_id`: stable external identifier for updates/deduplication
- `title`: search relevance and display
- `authors`: display and later ranking/filtering
- `isbn_13` / `isbn_10`: strongest identifier for matching and future purchase linking
- `image_url`: search-card quality
- `description`: richer result quality and future recommendations
- `published_date` / `published_year`: edition quality and sorting
- `categories`: genre/category filtering
- `raw_json`: keeps the original API data in case we need fields later

## Where The Data Comes From

Primary source:

- Google Books API

How we get it:

- backend ingestion script(s)
- backend refresh jobs
- optionally, search-triggered caching later

Important:

- for release work, we should not rely on users to build the catalog for us
- we should preload the catalog before release

## How Data Gets Into The Database

### Option A: Preload Before Release

Run ingestion jobs that fetch books from Google Books API using seed queries such as:

- popular authors
- popular titles
- major genres
- bestseller lists
- series/franchises

Then save those books into the database.

This gives us a real starting catalog before users arrive.

### Option B: Ongoing Enrichment

After launch, we can still:

- fetch new books from Google Books on demand
- save missing books that users search for
- refresh existing records when better metadata appears

This should extend the catalog, not create it from zero.

## Cleaning And Normalization Rules

Before saving each book:

- trim whitespace
- normalize title casing only if needed
- extract ISBN, preferring `ISBN_13`
- extract fallback `ISBN_10` if needed
- convert missing values to `null`
- store `published_year` separately from `published_date`
- join/normalize authors and categories consistently
- keep original API payload in `raw_json`

We should also deduplicate by:

- `google_books_id` first
- ISBN second when available

## Search Behavior After This Change

Current:

- frontend calls backend
- backend calls Google Books
- frontend shows Google response directly

Target:

- frontend calls backend
- backend searches our `books` table
- backend ranks and paginates our results
- frontend shows database-backed results

That gives us:

- stable pagination
- better control over quality
- consistent result ordering
- safer linking to Amazon later

## Ranking Rules For Our Stored Catalog

When users search, rank books higher if they have:

- strong title match
- ISBN present
- image present
- author present
- published year/date present
- description present

This is important because we want the books users click to be real, identifiable, and complete enough for later purchase linking.

## Suggested Implementation Phases

### Phase 1: Data Model

- create `Book` model
- add DB table/migration
- add indexes for title, Google ID, ISBN

### Phase 2: Ingestion

- write a service/helper that calls Google Books
- clean each item into our internal book shape
- upsert into the `books` table

### Phase 3: Seed Catalog

- define seed query lists
- run a preload/import job
- inspect and verify stored records

### Phase 4: Search Endpoint

- update `/recommendations/search` to query our database
- add ranking and pagination at DB/backend level

### Phase 5: Ongoing Refresh

- optionally store new books found from later searches
- periodically refresh popular records

## What We Do Not Need To Do

- we do not need to rewrite the whole app
- we do not need to stop using Google Books
- we do not need to enter books manually

What changes is the data/search layer:

- Google Books becomes the supplier
- our database becomes the catalog
- our backend becomes the search engine over that catalog

## Immediate Team Decision

We should start the database-backed catalog now if we want release-quality search.

Immediate next tasks:

1. define the `Book` database model
2. create the migration/table
3. build the ingestion/upsert function
4. prepare a first seed import strategy
5. switch search from Google live results to DB results once enough data is loaded
