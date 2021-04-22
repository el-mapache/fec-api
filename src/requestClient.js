import axios from 'axios';
import qs from 'qs';

/**
 * An axios interceptor to transform the request url.
 *
 * Given an axios config, map supplied url params to corresponding params in the url.
 * For example, if the url contains /:id, pass a params object
 * with a key of 'id', and the param placeholder in the url
 * will be replaced with the value associated with the param object's
 * key.
 */
function mapParamsToURLPath(config) {
  const { url, baseURL, params = {} } = config;

  if (!url) {
    return config;
  }

  // Construct a new url object for transformation
  const urlToTransform = new URL(url, baseURL);
  const urlParams = Object.entries(params);

  urlParams.forEach(([k, v]) => {
    urlToTransform.pathname = urlToTransform.pathname.replace(
      `:${k}`,
      encodeURIComponent(v)
    );
  });

  return {
    ...config,
    url: urlToTransform.pathname,
  };
}

const AxiosClient = (options = {}) => {
  const { apiKey, perPage, ...rest } = options;

  const instance = axios.create({
    baseURL: 'https://api.open.fec.gov/v1',
    method: 'get',
    params: {
      api_key: options.apiKey,
      per_page: options.perPage,
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
    ...rest,
  });

  instance.interceptors.request.use(mapParamsToURLPath);

  return instance;
};

export default AxiosClient;
