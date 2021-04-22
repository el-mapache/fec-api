import { baseUris } from "./constants";
import scheduleA from "./schedule-a";
import candidate from "./candidate";
import candidates from "./candidates";
import { buildEndpointDescriptors } from "../utils";

function endpointsPlugin(client) {
  const scheduleARoutes = buildEndpointDescriptors(
    baseUris.scheduleA,
    scheduleA,
    client
  );
  const candidateRoutes = buildEndpointDescriptors(
    baseUris.candidate,
    candidate,
    client
  );
  const candidatesRoutes = buildEndpointDescriptors(
    baseUris.candidates,
    candidates,
    client
  );

  return {
    candidate: candidateRoutes,
    candidates: candidatesRoutes,
    scheduleA: scheduleARoutes,
  };
}

endpointsPlugin.pluginName = "endpoints";

export default endpointsPlugin;

export { scheduleA };
