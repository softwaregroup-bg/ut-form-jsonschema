const uuid = require('uuid');
const servers = {};
const hapi = require('@hapi/hapi');
const inert = require('@hapi/inert');
const path = require('path');

async function callHandler(request, h, handler, log) {
    try {
        const {payload, headers} = await handler({
            payload: request.payload,
            ...request.query
        });
        const result = h.response(payload);
        if (headers) Object.entries(headers).forEach(([name, value]) => result.header(name, value));
        return result;
    } catch (e) {
        log && log.error && log.error(e);
        return h.response('Error').code(500);
    }
}

function addRoute(server, context, log, autoStop) {
    server.route([{
        method: 'POST',
        path: '/form/{id}/submit',
        options: {
            payload: {
                allow: [
                    'application/json'
                ]
            }
        },
        handler: async(request, h) => {
            const state = context.state[request.params.id];
            if (state) {
                state.formData = request.payload;
                const promise = context.promise[request.params.id];
                if (promise) {
                    promise.resolve(request.payload);
                    delete context.promise[request.params.id];
                }
                if (autoStop && Object.keys(context.promise).length === 0) {
                    context.server.stop();
                }
                const submit = context.submit[request.params.id];
                if (submit) {
                    return callHandler(request, h, submit, log);
                } else {
                    return h.response(state);
                }
            } else {
                return h.response('Form not found').code(404);
            }
        }
    }, {
        method: ['POST', 'GET'],
        path: '/api/{id}',
        handler: async(request, h) => {
            const handler = context.handler[request.params.id];
            if (handler) {
                return callHandler(request, h, handler, log);
            } else {
                return h.response('Schema not found').code(404);
            }
        }
    }, {
        method: 'GET',
        path: '/form/{id}/state.json',
        handler: (request, h) => {
            const state = context.state[request.params.id];
            if (state) {
                return h.response(state);
            } else {
                return h.response('Schema not found').code(404);
            }
        }
    }, {
        method: 'GET',
        path: '/form/{id}/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'dist'),
                lookupCompressed: true
            }
        }
    }]);
}

async function edit({schema, uiSchema, formData = {}, buttons, handler, submit, server: {host, port = 0, address = '0.0.0.0'} = {}, id = uuid.v4(), autoStop = true, log} = {}) {
    let current = servers[port];

    if (!current) {
        const server = new hapi.Server({port, host, address});
        current = {server, handler: {}, promise: {}, submit: {}, state: {}};
        await server.register([
            inert
        ]);
        addRoute(server, current, log, autoStop);
        server.events.on('stop', () => {
            delete servers[port];
        });
        server.events.on('start', () => {
            servers[port] = current;
        });
        await server.start();
    }
    if (handler) {
        current.handler[id] = handler;
        return new URL('/api/' + id, current.server.info.uri);
    }
    if (!schema) {
        return {id, url: new URL('/form/' + id + '/form.html', current.server.info.uri)};
    }
    current.state[id] = {schema, uiSchema, formData, buttons};
    if (submit) current.submit[id] = submit;
    return new Promise((resolve, reject) => {
        current.promise[id] = {
            resolve,
            reject
        };
    });
}

async function stop() {
    for (const server of Object.entries(servers)) {
        await server.stop();
    }
}

module.exports = {edit, stop};
