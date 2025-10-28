// Run in mongosh: mongosh --file queries.js
// Or open mongosh, then load("queries.js")

use('plp_bookstore');

// ----- Task 2: Basic CRUD Operations -----

// Insert: already handled by insert_books.js, but example for one more insert
// db.books.insertOne({
//   title: 'Refactoring', author: 'Martin Fowler', genre: 'Programming',
//   published_year: 1999, price: 31.5, in_stock: true, pages: 448, publisher: 'Addison-Wesley'
// });

// Find all books in a specific genre (example: 'Science Fiction')
print('\nFind: books in Science Fiction');
db.books.find({ genre: 'Science Fiction' });

// Find books published after a certain year (example: after 2015)
print('\nFind: books published after 2015');
db.books.find({ published_year: { $gt: 2015 } });

// Find books by a specific author (example: 'James Clear')
print('\nFind: books by James Clear');
db.books.find({ author: 'James Clear' });

// Update the price of a specific book (example: update price of 'Dune')
print('\nUpdate: set price of Dune to 17.99');
db.books.updateOne({ title: 'Dune' }, { $set: { price: 17.99 } });

// Delete a book by its title (example: delete 'Deep Work')
print('\nDelete: book with title Deep Work');
db.books.deleteOne({ title: 'Deep Work' });

// ----- Example Queries Provided by User -----

print('\nExamples: Find all books');
db.books.find();

print('\nExamples: Find books by author George Orwell');
db.books.find({ author: 'George Orwell' });

print('\nExamples: Find books published after 1950');
db.books.find({ published_year: { $gt: 1950 } });

print('\nExamples: Find books in genre Fiction');
db.books.find({ genre: 'Fiction' });

print('\nExamples: Find in-stock books');
db.books.find({ in_stock: true });

// ----- Task 3: Advanced Queries -----

// In stock and published after 2010
print('\nAdvanced: in stock and published after 2010');
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// Projection: only title, author, and price
print('\nProjection: title, author, price only');
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

// Sorting by price ascending
print('\nSort: price ascending');
db.books.find({}, { _id: 0, title: 1, price: 1 }).sort({ price: 1 });

// Sorting by price descending
print('\nSort: price descending');
db.books.find({}, { _id: 0, title: 1, price: 1 }).sort({ price: -1 });

// Pagination: 5 books per page (example: page 2 -> skip 5, limit 5)
const pageSize = 5;
const page = 2; // change to 1,2,3...
const skipCount = (page - 1) * pageSize;
print(`\nPagination: page ${page} (limit ${pageSize}, skip ${skipCount})`);
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 })
  .sort({ title: 1 })
  .skip(skipCount)
  .limit(pageSize);

// ----- Task 4: Aggregation Pipeline -----

// Average price of books by genre
print('\nAggregation: average price by genre');
db.books.aggregate([
  { $group: { _id: '$genre', averagePrice: { $avg: '$price' }, count: { $sum: 1 } } },
  { $sort: { averagePrice: -1 } }
]);

// Author with the most books
print('\nAggregation: author with most books');
db.books.aggregate([
  { $group: { _id: '$author', totalBooks: { $sum: 1 } } },
  { $sort: { totalBooks: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade and count them
print('\nAggregation: books by decade');
db.books.aggregate([
  { $project: { decade: { $concat: [ { $toString: { $multiply: [ { $floor: { $divide: ['$published_year', 10] } }, 10 ] } }, 's' ] } } },
  { $group: { _id: '$decade', count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);

// ----- Task 5: Indexing -----

// Create index on title
print('\nIndex: create on title');
db.books.createIndex({ title: 1 }, { name: 'idx_title_asc' });

// Create compound index on author and published_year
print('\nIndex: create compound on author + published_year');
db.books.createIndex({ author: 1, published_year: -1 }, { name: 'idx_author_year' });

// Explain a query before/after index (example: find by title)
print('\nExplain: find by title');
db.books.find({ title: 'Dune' }).explain('executionStats');

// Explain a compound query using the compound index
print('\nExplain: find by author/year');
db.books.find({ author: 'Andy Weir', published_year: { $gte: 2000 } }).explain('executionStats');

print('\nAll queries executed. Review printed sections and results above.');


