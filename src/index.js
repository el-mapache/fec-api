import AxiosClient from './requestClient';

function isPlainObject(maybeObj) {
  return (
    !(maybeObj instanceof Function) &&
    !(maybeObj instanceof Array) &&
    maybeObj !== null &&
    typeof maybeObj === 'object'
  );
}

class FECRequestor {
  static VERSION = '0.0.1';
  static defaultParams = {
    per_page: 60,
  };
  static defaultRequest = {};

  constructor({ apiKey, plugins = [], clientOptions = {}, debug }) {
    this.requestParams = {
      ...this.constructor.defaultParams,
      api_key: apiKey,
    };

    this.debug = debug;
    this.client = AxiosClient(clientOptions);
    this.request = this.constructor.defaultRequest;

    this.defaultGet = async (extraParams = {}) => {
      const { endpoint, params } = this.request;
      if (!isPlainObject(extraParams)) {
        throw new Error(
          'FEC API methods only accept additional params as objects'
        );
      }

      try {
        const response = await this.client.get(endpoint, {
          params: {
            ...this.requestParams,
            ...params,
            ...extraParams,
          },
        });

        return response;
      } catch (error) {
        throw error;
      }
    };

    plugins.forEach((plugin) => Object.assign(this, plugin(this)));
  }

  buildRequest(endpoint, params) {
    if (typeof endpoint !== 'string' || !endpoint) {
      throw new TypeError('Requests cannot be created without an endpoint.');
    }

    this.request = {
      endpoint,
      params,
      get: this.defaultGet,
    };
  }

  get(endpoint, params = {}) {
    if (!this.request.endpoint) {
      this.buildRequest(endpoint);
    }

    return this.request.get(params);
  }
}

export default FECRequestor;
