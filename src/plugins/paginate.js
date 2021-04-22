function paginatePlugin(client) {
  let pagination = {};
  /**
   * Pagination can come back in one of two forms
   * in the FEC api (annoyingly)
   *
   * It will either have the `lastIndexes` signature,
   * which is an object with `last_index` and some arbitrary sort parameter,
   * or it will have two properties `page` and `pages`.
   *
   * This helper normalizes these two objects and returns a pagination
   * object suitable for passing as extra params to our request method.
   */
  function normalizePagination(paginateInfo) {
    const isLastPage = (info) =>
      typeof info.page === 'undefined' && info.page === info.pages;

    if (paginateInfo.last_indexes) {
      pagination = { ...paginateInfo.last_indexes };
    } else if (!isLastPage(paginateInfo)) {
      // technically this could be a generator too!
      pagination = { page: paginateInfo.page + 1 };
    } else {
      pagination = null;
    }
  }

  async function* page(params = {}, method) {
    client.logger('pagination state', pagination);
    let res;
    let request = method.get || client.request.get;

    try {
      res = await request({ ...params, ...pagination });

      client.logger('pagination response', res.data.pagination);

      if (res.status === 200) {
        normalizePagination(res.data.pagination);
      }

      if (!pagination) {
        // We've reached the last page of results, so
        // don't let the user get any more values.
        return res;
      }

      yield res;
    } catch (error) {
      yield error.response;
    }
  }

  return {
    async paginate(params, method) {
      const response = await page(params, method).next();

      return {
        ...response.value,
        done: response.done,
      };
    },
  };
}

export default paginatePlugin;
