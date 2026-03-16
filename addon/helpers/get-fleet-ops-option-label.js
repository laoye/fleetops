import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import fleetOpsOptions from '../utils/fleet-ops-options';

function camelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function getFleetOpsOptionLabel(optionsKey, value, intl) {
    const allOptions = fleetOpsOptions(optionsKey);
    const option = allOptions.find((opt) => opt.value === value);
    if (!option) {
        return null;
    }

    if (intl) {
        const labelKey = `fleet-ops-options.${camelToKebab(optionsKey)}.${option.value}`;
        if (intl.exists(labelKey)) {
            return intl.t(labelKey);
        }
    }

    return option.label;
}

export default class GetFleetOpsOptionLabelHelper extends Helper {
    @service intl;

    compute([optionsKey, value]) {
        return getFleetOpsOptionLabel(optionsKey, value, this.intl);
    }
}
