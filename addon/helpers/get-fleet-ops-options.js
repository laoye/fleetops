import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import fleetOpsOptions from '../utils/fleet-ops-options';

function camelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export default class GetFleetOpsOptionsHelper extends Helper {
    @service intl;

    compute([key]) {
        const options = fleetOpsOptions(key);
        const prefix = `fleet-ops-options.${camelToKebab(key)}`;

        return options.map((option) => {
            const labelKey = `${prefix}.${option.value}`;
            const descKey = `${prefix}.${option.value}-description`;
            return {
                ...option,
                label: this.intl.exists(labelKey) ? this.intl.t(labelKey) : option.label,
                description: this.intl.exists(descKey) ? this.intl.t(descKey) : option.description,
            };
        });
    }
}
