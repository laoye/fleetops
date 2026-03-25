import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isArray } from '@ember/array';

export default class ConnectivityDevicesIndexDetailsController extends Controller {
    @service('universe/menu-service') menuService;
    @service hostRouter;
    @service intl;

    get tabs() {
        const registeredTabs = this.menuService.getMenuItems('fleet-ops:component:place:details');
        return [
            {
                route: 'connectivity.devices.index.details.index',
                label: this.intl.t('common.overview'),
            },
            ...(isArray(registeredTabs) ? registeredTabs : []),
        ];
    }

    get actionButtons() {
        return [
            {
                icon: 'pencil',
                fn: () => this.hostRouter.transitionTo('console.fleet-ops.connectivity.devices.index.edit', this.model),
            },
        ];
    }
}
