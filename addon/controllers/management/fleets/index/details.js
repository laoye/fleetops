import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isArray } from '@ember/array';

export default class ManagementFleetsIndexDetailsController extends Controller {
    @service('universe/menu-service') menuService;
    @service hostRouter;
    @service intl;

    get tabs() {
        const registeredTabs = this.menuService.getMenuItems('fleet-ops:component:place:details');
        return [
            {
                route: 'management.fleets.index.details.index',
                label: this.intl.t('common.overview'),
            },
            {
                route: 'management.fleets.index.details.vehicles',
                label: this.intl.t('resource.vehicles'),
            },
            {
                route: 'management.fleets.index.details.drivers',
                label: this.intl.t('resource.drivers'),
            },
            ...(isArray(registeredTabs) ? registeredTabs : []),
        ];
    }

    get actionButtons() {
        return [
            {
                icon: 'pencil',
                fn: () => this.hostRouter.transitionTo('console.fleet-ops.management.fleets.index.edit', this.model),
            },
        ];
    }
}
