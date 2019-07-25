# ut-form-jsonschema

## Usage

* Method `edit(options)`

  ```js
  const {edit} = return require('ut-form-jsonschema');
  ```

  Where `options` is object with the following properties:
  * `schema` - JSON schema passed to [react-jsonschema-form](https://www.npmjs.com/package/react-jsonschema-form)
  * `uiSchema` - UI schema passed to [react-jsonschema-form](https://www.npmjs.com/package/react-jsonschema-form)
  * `formData` - form data passed to [react-jsonschema-form](https://www.npmjs.com/package/react-jsonschema-form)
  * `buttons` - array of `MaterialUI <Button>` configuration properties
  * `handler` - function, that handles custom API calls
  * `submit` - function, that handles form submit
  * `server` - configuration object for Hapi server, can have properties
    `host`, `port` and `address`
  * `id` - unique identifier of the form / api, uuid.v4 will be used if left empty
  * `autoStop` - pass `false` to avoid autostopping http server after all forms
    have been handled
  * `log` - logger

## Example

```js
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
```
