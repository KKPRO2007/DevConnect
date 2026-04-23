function buildPostQuery(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;
  const filters = {};

  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { content: { $regex: query.search, $options: "i" } },
      { excerpt: { $regex: query.search, $options: "i" } }
    ];
  }

  if (query.author) {
    filters.author = query.author;
  }

  if (query.tag) {
    filters.tags = query.tag;
  }

  return {
    filters,
    page,
    limit,
    skip
  };
}

module.exports = buildPostQuery;
