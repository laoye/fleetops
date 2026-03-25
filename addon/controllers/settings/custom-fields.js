import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class SettingsCustomFieldsController extends Controller {
    @service intl;

    get subjects() {
        return [
            {
                model: 'driver',
                type: 'fleet-ops:driver',
                label: this.intl.t('resource.driver'),
                groups: [],
            },
            {
                model: 'vehicle',
                type: 'fleet-ops:vehicle',
                label: this.intl.t('resource.vehicle'),
                groups: [],
            },
            {
                model: 'contact',
                type: 'fleet-ops:contact',
                label: this.intl.t('resource.contact'),
                groups: [],
            },
            {
                model: 'vendor',
                type: 'fleet-ops:vendor',
                label: this.intl.t('resource.vendor'),
                groups: [],
            },
            {
                model: 'place',
                type: 'fleet-ops:place',
                label: this.intl.t('resource.place'),
                groups: [],
            },
            {
                model: 'entity',
                type: 'fleet-ops:entity',
                label: this.intl.t('resource.entity'),
                groups: [],
            },
            {
                model: 'fleet',
                type: 'fleet-ops:fleet',
                label: this.intl.t('resource.fleet'),
                groups: [],
            },
            {
                model: 'issue',
                type: 'fleet-ops:issue',
                label: this.intl.t('resource.issue'),
                groups: [],
            },
            {
                model: 'fuel-report',
                type: 'fleet-ops:fuel-report',
                label: this.intl.t('resource.fuel-report'),
                groups: [],
            },
        ];
    }
}
