import React, {Component} from 'react';
import {render} from 'react-dom';
import Form from 'rjsf-material-ui';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
const request = require('ut-browser-request');

class JsonForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const submit = ({formData}) => {
            request.post({url: 'submit', json: true, body: formData}, (error, response) => {
                if (error) {
                    //
                } else if (response.statusCode < 200 || response.statusCode >= 300) {
                    //
                } else {
                    if (response.body.redirect) {
                        window.location.pathname = response.body.redirect;
                    } else if (response.body.state) {
                        this.setState(response.body.state);
                    }
                }
            });
        };
        const {schema, formData = {}, uiSchema = {}, buttons = [{}]} = this.state;
        return schema ? <Form schema={schema} uiSchema={uiSchema} formData={formData} onSubmit={submit}>
            <Box mt={2}>{
                buttons.map(({title = 'Submit', ...rest}, index) =>
                    <Button key={index} variant='contained' color='primary' type='submit' {...rest}>{title}</Button>)
            }</Box>
        </Form> : 'Loading...';
    }

    componentDidMount() {
        request.get({url: 'state.json', json: true}, (error, response) => {
            if (error) {
                //
            } else if (response.statusCode < 200 || response.statusCode >= 300) {
                //
            } else {
                this.setState(response.body);
            }
        });
    }
}

render((
    <Paper className='paper'>
        <JsonForm />
    </Paper>
), document.getElementById('app'));
