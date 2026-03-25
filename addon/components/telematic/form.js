import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class TelematicFormComponent extends Component {
    @service fetch;
    @service notifications;
    @service intl;
    @tracked providers = [];
    @tracked selectedProvider = this.args.resource?.provider_descriptor ?? null;
    @tracked connectionTestResult;

    get credentialsActionButtons() {
        return [
            {
                size: 'xs',
                icon: 'plug',
                text: this.intl.t('common.test-connection'),
                onClick: () => this.testConnection.perform(),
                isLoading: this.testConnection.isRunning,
            },
        ];
    }

    constructor() {
        super(...arguments);
        this.loadProviders.perform();
    }

    @action setCredential(field, { target: { value } }) {
        const credentials = this.args.resource.credentials ?? {};
        this.args.resource.set('credentials', {
            ...credentials,
            [field.name]: value,
        });
    }

    @action selectProvider(provider) {
        this.selectedProvider = provider;
        this.args.resource.setProperties({
            provider: provider.key,
            credentials: (provider.required_fields ?? {}).reduce((acc, item) => {
                acc[item.name] = null;
                return acc;
            }, {}),
        });
    }

    @task *loadProviders() {
        try {
            const providers = yield this.fetch.get('telematics/providers');
            this.providers = providers;
        } catch (err) {
            this.notifications.serverError(err);
        }
    }

    @task *testConnection() {
        try {
            const result = yield this.fetch.post(`telematics/${this.selectedProvider.key}/test-credentials`, { credentials: this.args.resource.credentials });
            this.connectionTestResult = result;

            if (result.success) {
                this.notifications.success(this.intl.t('notifications.connection-successful'));
            } else {
                this.notifications.error(result.message);
            }
        } catch (error) {
            this.connectionTestResult = {
                success: false,
                message: error.message || this.intl.t('notifications.connection-failed'),
            };
            this.notifications.error(this.intl.t('notifications.connection-failed'));
        }
    }
}
