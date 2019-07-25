const {edit} = require('../..');

async function login() {
    const {url, id} = await edit({server: {host: 'localhost'}});
    console.log('Login at', url.href);
    const {user, password} = await edit({
        id,
        schema: {
            title: 'Login',
            type: 'object',
            properties: {
                user: {
                    type: 'string',
                    title: 'User name'
                },
                password: {
                    type: 'string',
                    title: 'Password'
                }
            },
            required: ['user', 'password']
        },
        uiSchema: {
            password: {
                'ui:widget': 'password'
            }
        }
    });
    console.log(user, password);
}

login();
