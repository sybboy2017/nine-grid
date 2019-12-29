const proxy = {
    'POST /api/user': {
        id: 1,
        username: 'MOMO',
        sex: 1,
    },
    'POST /api/user/list': [
        {
            id: 1,
            username: 'MOMO1',
            sex: 1,
        }, {
            id: 2,
            username: 'MOMO2',
            sex: 0,
        },
    ],
    'POST /api/login/account': (req, res) => {
        const { password, username } = req.body;
        if (password === '888888' && username === 'admin') {
            return res.json({
                status: 'ok',
                code: 0,
                token: 'sdfsdfsdfdsf',
                data: {
                    id: 1,
                    username: 'kenny',
                    sex: 6,
                },
            });
        }
        return res.json({
            status: 'error',
            code: 403,
        });
    },
};
module.exports = proxy;
