import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ManagementContactsIndexDetailsController extends Controller {
    @service hostRouter;
    @service intl;
    get tabs() {
        return [
            {
                route: 'management.contacts.index.details.index',
                label: this.intl.t('common.overview'),
            },
        ];
    }
    @tracked actionButtons = [
        {
            icon: 'pencil',
            fn: () => this.hostRouter.transitionTo('console.fleet-ops.management.contacts.index.edit', this.model),
        },
    ];
}
