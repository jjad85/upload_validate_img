class ExceptionGeneral extends Error {
    constructor(mssg, status) {
        super(mssg);
        this.status = status;
    }
}
module.exports = ExceptionGeneral;
