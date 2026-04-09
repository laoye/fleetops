import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ManagementWarehouseRoute extends Route {
    @service notifications;
    @service hostRouter;
    @service intl;

    setupController(controller) {
        super.setupController(...arguments);
        // 进入页面时自动加载默认 Tab 数据
        controller.loadTab.perform('pending-inbound');
    }
}
