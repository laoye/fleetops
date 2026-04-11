import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class ManagementWarehouseController extends Controller {
    @service fetch;
    @service notifications;
    @service intl;

    /** 当前激活 Tab: pending-inbound | inventory | pending-outbound */
    @tracked activeTab = 'pending-inbound';

    /** 三个队列数据 */
    @tracked pendingInbound = [];
    @tracked inventory = [];
    @tracked pendingOutbound = [];

    /** 扫码 overlay */
    @tracked showScanPanel = false;
    @tracked scanMode = 'scan-in';   // scan-in | scan-out
    @tracked scanCode = '';
    @tracked scanError = null;
    @tracked scanSuccess = null;

    /** Tab 定义 */
    get tabs() {
        return [
            { key: 'pending-inbound',  label: '待入库', icon: 'inbox',         count: this.pendingInbound.length },
            { key: 'inventory',        label: '在库',   icon: 'warehouse',      count: this.inventory.length },
            { key: 'pending-outbound', label: '待出库', icon: 'truck-ramp-box', count: this.pendingOutbound.length },
        ];
    }

    /** 当前 Tab 数据 */
    get currentRows() {
        if (this.activeTab === 'pending-inbound')  return this.pendingInbound;
        if (this.activeTab === 'inventory')        return this.inventory;
        if (this.activeTab === 'pending-outbound') return this.pendingOutbound;
        return [];
    }

    get isLoading() {
        return this.loadTab.isRunning;
    }

    /** 切换 Tab */
    @action switchTab(key) {
        this.activeTab = key;
        this.loadTab.perform(key);
    }

    /** 加载当前 Tab 数据 */
    @task *loadTab(tab) {
        const t = tab || this.activeTab;
        const endpoint = {
            'pending-inbound':  'forbox/int/v1/warehouse/pending-inbound',
            'inventory':        'forbox/int/v1/warehouse/inventory',
            'pending-outbound': 'forbox/int/v1/warehouse/pending-outbound',
        }[t];
        if (!endpoint) return;

        try {
            const response = yield this.fetch.get(endpoint, { per_page: 100 });
            const rows = response?.data?.data ?? response?.data ?? [];
            if (t === 'pending-inbound')  this.pendingInbound  = rows;
            if (t === 'inventory')        this.inventory        = rows;
            if (t === 'pending-outbound') this.pendingOutbound  = rows;
        } catch (err) {
            this.notifications.serverError(err);
        }
    }

    /** 刷新当前 Tab */
    @action refresh() {
        this.loadTab.perform(this.activeTab);
    }

    // ── 扫码 Panel ──────────────────────────────────────────────────

    @action openScanPanel(mode) {
        this.scanMode    = mode;
        this.scanCode    = '';
        this.scanError   = null;
        this.scanSuccess = null;
        this.showScanPanel = true;
    }

    @action closeScanPanel() {
        this.showScanPanel = false;
    }

    /** 提交扫码 */
    @task *submitScan() {
        this.scanError   = null;
        this.scanSuccess = null;

        const code = this.scanCode.trim();
        if (!code) {
            this.scanError = '请输入运单号或扫描条码';
            return;
        }

        try {
            let response;

            if (this.scanMode === 'scan-in') {
                response = yield this.fetch.post('forbox/int/v1/warehouse/scan-in', { code });
                this.scanSuccess = `入库成功：${response?.data?.order_public_id ?? code}`;
                this.pendingInbound = this.pendingInbound.filter(o => o.uuid !== response?.data?.order_uuid);

            } else if (this.scanMode === 'scan-out') {
                response = yield this.fetch.post('forbox/int/v1/warehouse/scan-out', { code });
                this.scanSuccess = `出库成功：${response?.data?.order_public_id ?? code}`;
                this.pendingOutbound = this.pendingOutbound.filter(o => o.uuid !== response?.data?.order_uuid);
            }

            this.scanCode = '';
        } catch (err) {
            this.scanError = err?.payload?.message ?? err?.message ?? '操作失败，请重试';
        }
    }

    /** 快捷操作：从列表行直接触发 */
    @action quickScanIn(order) {
        this.openScanPanel('scan-in');
        this.scanCode = order?.tracking_number?.tracking_number ?? order?.public_id ?? '';
    }

    @action quickScanOut(order) {
        this.openScanPanel('scan-out');
        this.scanCode = order?.tracking_number?.tracking_number ?? order?.public_id ?? '';
    }
}
