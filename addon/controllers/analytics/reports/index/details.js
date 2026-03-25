import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class AnalyticsReportsIndexDetailsController extends Controller {
    @service hostRouter;
    @service intl;
    get tabs() {
        return [
            {
                route: 'analytics.reports.index.details.index',
                label: this.intl.t('common.overview'),
            },
            {
                route: 'analytics.reports.index.details.result',
                label: this.intl.t('common.result'),
                icon: 'table',
            },
        ];
    }
    @tracked actionButtons = [
        {
            icon: 'pencil',
            fn: () => this.hostRouter.transitionTo('console.fleet-ops.analytics.reports.index.edit', this.model),
        },
    ];
}
