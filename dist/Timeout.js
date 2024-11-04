export default class Timeout {
    id;
    handler;
    constructor(handler, timer) {
        this.id = setTimeout(handler, timer);
        this.handler = handler;
    }
    clear() {
        clearTimeout(this.id);
    }
}
//# sourceMappingURL=Timeout.js.map