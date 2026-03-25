import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isArray } from '@ember/array';

export default class ManagementVehiclesIndexDetailsController extends Controller {
    @service intl;
    @service('universe/menu-service') menuService;
    @service hostRouter;

    get tabs() {
        const registeredTabs = this.menuService.getMenuItems('fleet-ops:component:vehicle:details');
        return [
            {
                route: 'management.vehicles.index.details.index',
                label: this.intl.t('vehicle.form.overview-tab'),
            },
            {
                route: 'management.vehicles.index.details.positions',
                label: this.intl.t('vehicle.form.positions-tab'),
            },
            {
                route: 'management.vehicles.index.details.devices',
                label: this.intl.t('vehicle.form.devices-tab'),
            },
            ...(isArray(registeredTabs) ? registeredTabs : []),
        ];
    }

    get actionButtons() {
        return [
            {
                icon: 'pencil',
                fn: () => this.hostRouter.transitionTo('console.fleet-ops.management.vehicles.index.edit', this.model),
            },
        ];
    }
}
