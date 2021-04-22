// Factory function to create a data structure describing a required parameter of an FEC API endpoint
export function buildRequiredDescriptor({ param, type, message }) {
  const formattedMessageForParam = `Param \`${param}\ is required! ${message}`;

  return {
    name: param,
    type,
    message: formattedMessageForParam,
  };
}

function baseMethod(client, apiBase, endpoint, defaults = {}) {
  return function (filterParams) {
    client.buildRequest(`${apiBase}/${endpoint}`, {
      ...defaults,
      ...filterParams,
    });

    return client;
  };
}
// Factory function to create a endpoint request object from an endpoint config
/**
 * Accepts an array of config object with the following signature
 * uri: string
 * method: string
 * defaults?: Record<string, any>
 * required?: RequiredDescriptor[]
 */
export function buildEndpointDescriptors(baseUrl, endpointConfigs, client) {
  return endpointConfigs.reduce((api, endpointSchema) => {
    const method = baseMethod(
      client,
      baseUrl,
      endpointSchema.uri,
      endpointSchema.defaults
    );

    Object.defineProperty(api, endpointSchema.method, {
      get() {
        //TODO perhaps these methods are stored in a lookup, get proxies to that and
        // returns an IIFE calls method with the proper filters, and returns the get fn
        // if no filters are passed supply all props to fn? how to tell if no filters are passed?
        // Might be better if the interceptor just transforms the params and strips out
        // the url params, and passes the rest as query params
        return method().request.get;
      },
    });

    return api;
  }, {});
}
