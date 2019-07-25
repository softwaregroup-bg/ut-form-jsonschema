/* eslint no-console:0 */
const form = require('../..');

async function test() {
    const info = await form.get({
        schema: {
            title: 'Todo',
            type: 'object',
            required: ['title'],
            properties: {
                title: {
                    type: 'string',
                    title: 'Title',
                    default: 'A new task'
                },
                done: {
                    type: 'boolean',
                    title: 'Done?',
                    default: false
                }
            }
        },
        port: 80,
        stop: true,
        log: console.log
    });
    console.log(await info);
}

test();
