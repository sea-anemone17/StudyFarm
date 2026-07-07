import { bindNavigation } from "./navigation.js";
import { bindKiwiEvents } from "./kiwiEvents.js";
import { bindStudyEvents } from "./studyEvents.js";
import { bindFarmEvents } from "./farmEvents.js";
import { bindStorageEvents } from "./storageEvents.js";

export function bindEvents(context) {
  bindNavigation(context);
  bindKiwiEvents(context);
  bindStudyEvents(context);
  bindFarmEvents(context);
  bindStorageEvents(context);
}
