const defaults = {
  maxRetries: 3,
  hardFail: [400, 401, 403, 404, 422],
  enabled: true,
  retryAfter: 1000
};


function retryPlugin(client, config) {
  const state = {
    ...defaults,
    ...config
  };

  if (!state.enabled) {
    return;
  }

  const withRetry = originalGet => async (params = {}) => {
    let attempts = 0;
    let cancelId;

    async function doAttempt() {
      try {
        const response = await originalGet(params);
  
        return response;
      } catch(error) {        
        const { response } = error;
        const { maxRetries, hardFail } = state;
        
        if (
          response.status > 400 &&
          !hardFail.includes(response.status) &&
          attempts <= maxRetries
        ) {
          attempts += 1;

          return new Promise((resolve) => {
            // unclear if this actually ever results  in a race condition.
            // the timeout is only set when this function is called, and we are guaranteed not
            // to call it until one has resolved
            cancelId = setTimeout(async () => {
              try {
                const result = await doAttempt();
                return resolve(result);
              } catch(error) {
                resolve(error);
              } finally {
                clearTimeout(cancelId);
              }
            }, Math.pow(10, attempts - 1) + 100);
          });
        } else {
          throw(error);
        }
      }
    }

    return new Promise(async (resolve) => {
      try {
        const result = await doAttempt();
        return resolve(result);
      } catch(error) {
        resolve(error);
      } finally {
        attempts = 0;
      }
    });
  };

  // really this should allow for an array of get functions,
  //each one passing its results of the previous get thru the chain,
  // alternatively, the developer could describe the steps they
  // want the gets to move thru
  client.defaultGet = withRetry(client.defaultGet);
}

export default retryPlugin;
