import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import getCurrentNestedController from '@fleetbase/ember-core/utils/get-current-nested-controller';

export default class ManagementContactsController extends Controller {
    @service hostRouter;
    @service intl;

    get tabs() {
        return [
            {
                route: 'management.contacts.index',
                label: this.intl.t('resource.contacts'),
            },
            {
                route: 'management.contacts.customers',
                label: this.intl.t('resource.customers'),
            },
        ];
    }

    get childController() {
        return getCurrentNestedController(getOwner(this), this.hostRouter.currentRouteName);
    }
}
