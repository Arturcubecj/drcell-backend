export const responses_success = (data, mensaje) => {
    return {
        success:     true,
        data:        data,
        status_code: 200,
        message:     mensaje
    };
};

export const responses_created = (id, mensaje) => {
    return {
        success:     true,
        record_id:   id,
        status_code: 201,
        message:     mensaje
    };
};

export const responses_not_found = (mensaje) => {
    return {
        success:     false,
        status_code: 404,
        message:     mensaje
    };
};

export const responses_error = (mensaje) => {
    return {
        success:     false,
        status_code: 500,
        message:     mensaje
    };
};

export const bad_request = (mensaje) => {
    return {
        success:     false,
        status_code: 400,
        message:     mensaje
    };
};