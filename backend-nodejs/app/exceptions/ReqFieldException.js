class ReqFieldException extends Error{
    constructor(field){
        super(field + " es requerido");
        this.status = 401;
    };
};

module.exports = ReqFieldException;