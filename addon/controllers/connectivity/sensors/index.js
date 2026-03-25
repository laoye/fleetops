import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { localizeFleetOpsOptions } from '../../../utils/fleet-ops-options';

export default class ConnectivitySensorsIndexController extends Controller {
    @service sensorActions;
    @service deviceActions;
    @service telematicActions;
    @service intl;

    /** query params */
    @tracked queryParams = ['name', 'page', 'limit', 'sort', 'query', 'public_id', 'created_at', 'updated_at'];
    @tracked page = 1;
    @tracked limit;
    @tracked sort = '-created_at';
    @tracked public_id;
    @tracked name;

    /** action buttons */
    @tracked actionButtons = [
        {
            icon: 'refresh',
            onClick: this.sensorActions.refresh,
            helpText: this.intl.t('common.refresh'),
        },
        {
            text: this.intl.t('common.new'),
            type: 'primary',
            icon: 'plus',
            onClick: this.sensorActions.transition.create,
        },
        {
            text: this.intl.t('common.import'),
            type: 'magic',
            icon: 'upload',
            onClick: this.sensorActions.import,
        },
        {
            text: this.intl.t('common.export'),
            icon: 'long-arrow-up',
            iconClass: 'rotate-icon-45',
            wrapperClass: 'hidden md:flex',
            onClick: this.sensorActions.export,
        },
    ];

    /** bulk action buttons */
    @tracked bulkActions = [
        {
            label: this.intl.t('common.delete-selected'),
            class: 'text-red-500',
            fn: this.sensorActions.bulkDelete,
        },
    ];

    /** columns */
    @tracked columns = [
        {
            sticky: true,
            label: this.intl.t('column.name'),
            valuePath: 'displayName',
            cellComponent: 'table/cell/anchor',
            cellClassNames: 'uppercase',
            action: this.sensorActions.transition.view,
            permission: 'fleet-ops view sensor',
            resizable: true,
            sortable: true,
            filterable: true,
            filterParam: 'name',
            filterComponent: 'filter/string',
        },
        {
            label: this.intl.t('common.telematic'),
            valuePath: 'telematic.provider',
            cellComponent: 'table/cell/anchor',
            action: this.telematicActions.transition.view,
            permission: 'fleet-ops view telematic',
            resizable: true,
            sortable: true,
            filterable: true,
            filterComponent: 'filter/model',
            filterComponentPlaceholder: this.intl.t('common.select-resource', { resource: this.intl.t('resource.telematic') }),
            filterParam: 'telematic',
            model: 'telematic',
        },
        {
            label: this.intl.t('common.device'),
            valuePath: 'device.displayName',
            cellComponent: 'table/cell/anchor',
            action: this.deviceActions.transition.view,
            permission: 'fleet-ops view device',
            resizable: true,
            sortable: true,
            filterable: true,
            filterComponent: 'filter/model',
            filterComponentPlaceholder: this.intl.t('common.select-resource', { resource: this.intl.t('resource.device') }),
            filterParam: 'device',
            model: 'device',
        },
        {
            label: this.intl.t('column.type'),
            valuePath: 'type',
            resizable: true,
            sortable: true,
            filterable: true,
            filterParam: 'type',
            filterComponent: 'filter/multi-option',
            filterOptions: localizeFleetOpsOptions(this.intl, 'sensorTypes'),
        },
        {
            label: this.intl.t('common.serial-number'),
            valuePath: 'serial_number',
            resizable: true,
            sortable: true,
            filterable: true,
            filterParam: 'serial_number',
            filterComponent: 'filter/string',
        },
        {
            label: this.intl.t('column.status'),
            valuePath: 'status',
            cellComponent: 'table/cell/status',
            resizable: true,
            sortable: true,
            filterable: true,
            filterComponent: 'filter/multi-option',
            filterOptions: localizeFleetOpsOptions(this.intl, 'sensorStatuses'),
        },
        {
            label: this.intl.t('column.created-at'),
            valuePath: 'createdAt',
            sortParam: 'created_at',
            resizable: true,
            sortable: true,
            filterable: true,
            filterComponent: 'filter/date',
        },
        {
            label: this.intl.t('column.updated-at'),
            valuePath: 'updatedAt',
            sortParam: 'updated_at',
            resizable: true,
            sortable: true,
            hidden: true,
            filterable: true,
            filterComponent: 'filter/date',
        },

        {
            label: '',
            cellComponent: 'table/cell/dropdown',
            ddButtonText: false,
            ddButtonIcon: 'ellipsis-h',
            ddButtonIconPrefix: 'fas',
            ddMenuLabel: this.intl.t('common.resource-actions', { resource: this.intl.t('resource.sensor') }),
            cellClassNames: 'overflow-visible',
            wrapperClass: 'flex items-center justify-end mx-2',
            sticky: 'right',
            width: 60,
            actions: [
                {
                    label: this.intl.t('common.view-resource', { resource: this.intl.t('resource.sensor') }),
                    fn: this.sensorActions.transition.view,
                    permission: 'fleet-ops view sensor',
                },
                {
                    label: this.intl.t('common.edit-resource', { resource: this.intl.t('resource.sensor') }),
                    fn: this.sensorActions.transition.edit,
                    permission: 'fleet-ops update sensor',
                },
                {
                    separator: true,
                },
                {
                    label: this.intl.t('common.delete-resource', { resource: this.intl.t('resource.sensor') }),
                    fn: this.sensorActions.delete,
                    permission: 'fleet-ops delete sensor',
                },
            ],
            sortable: false,
            filterable: false,
            resizable: false,
            searchable: false,
        },
    ];
}
