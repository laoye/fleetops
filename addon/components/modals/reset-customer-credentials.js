import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ModalsResetCustomerCredentialsComponent extends Component {
    @service fetch;
    @service notifications;
    @service intl;
    @tracked options = {};
    @tracked password;
    @tracked confirmPassword;
    @tracked sendCredentials = true;
    @tracked customer;

    constructor(owner, { options }) {
        super(...arguments);
        this.customer = options.customer;
        this.options = options;
        this.setupOptions();
    }

    setupOptions() {
        this.options.title = this.intl.t('modals.reset-customer-credentials');
        this.options.acceptButtonText = this.intl.t('modals.reset-credentials-button');
        this.options.declineButtonHidden = true;
        this.options.confirm = async (modal) => {
            modal.startLoading();

            try {
                await this.fetch.post('customers/reset-credentials', {
                    customer: this.customer.id,
                    password: this.password,
                    password_confirmation: this.confirmPassword,
                    send_credentials: this.sendCredentials,
                });

                this.notifications.success(this.intl.t('notifications.customer-password-reset'));

                if (typeof this.options.onPasswordResetComplete === 'function') {
                    this.options.onPasswordResetComplete();
                }

                modal.done();
            } catch (error) {
                this.notifications.serverError(error);
                modal.stopLoading();
            }
        };
    }
}
