/* eslint-disable no-unused-vars */
import mk from '@fes/mo-mock';

export default {
    getProfile(data, done, error) {
        mk.ajax({
            url: '/api/user',
            data,
            dataType: 'json',
            success: done,
            error,
        });
    },
};
