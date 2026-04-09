import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class WidgetForboxOpsComponent extends Component {
    static widgetId = 'forbox-ops-widget';

    @service fetch;

    @tracked data = null;

    constructor() {
        super(...arguments);
        this.loadStats.perform();
    }

    @task *loadStats() {
        try {
            const response = yield this.fetch.get('forbox/int/v1/operations/stats');
            this.data = response?.data ?? null;
        } catch {
            this.data = null;
        }
    }
}
