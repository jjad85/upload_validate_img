class NotAuthException extends Error{
    constructor(){
        super("Error, no autorizado");
        this.status = 401;
    };
};

module.exports = NotAuthException;