/**
 * Plugin to add logging to the request client
 * @param client Instance of FECRequestor
 */
function logPlugin(client) {
  function logger(message, ...args) {
    client.debug && console.log(message, ...args);
  }

  return {
    logger,
  };
}

export default logPlugin;
