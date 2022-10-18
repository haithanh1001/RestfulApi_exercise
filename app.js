const express = require('express');
const Joi = require('@hapi/joi');
const moment = require('moment');

const app = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST || "localhost";
const customers = [
    {id:1,name:"name 1"},
    {id:2,name:"name 2"},
    {id:3,name:"name 3"},
    {id:4,name:"name 4"},
    {id:5,name:"name 5"},
    {id:6,name:"name 6"},
    {id:7,name:"name 7"},
]

app.use(express.json())

app.get('/',(req,res)=>{
    res.send(moment().format("DD/MM/YYYY HH:mm:ss"));
})

app.get('/api/customers',(req,res)=>{
    res.send(customers);
})

app.get('/api/customers/:id',(req,res)=>{
    const customer = customers.find(c=>c.id === parseInt(req.params.id));
    if(!customer) return res.status(404).send('The customer with the ID given was not found!');
    res.send(customer);
})

app.post('/api/customers',(req,res)=>{
    const {error} = validateCustomer(req.body)
    if(error) return res.status(400).send(error.details[0].message);
    const customer = {
        id: customers.length + 1,
        name: req.body.name
    }
    customers.push(customer);
    res.send(customer);
})

app.put('/api/customers/:id',(req,res)=>{
    const customer = customers.find(c=>c.id === parseInt(req.params.id));
    if(!customer) return res.status(404).send('The customer with the ID given was not found!');
    const {error} = validateCustomer(req.body)
    if(error) return res.status(400).send(error.details[0].message);
    customer.name = req.body.name;
    res.send(customer);
})

app.delete('/api/customers/:id',(req,res)=>{
    const customer = customers.find(c=>c.id === parseInt(req.params.id));
    if(!customer) return res.status(404).send('The customer with the ID given was not found!');
    const index = customers.indexOf(customer);
    customers.splice(index,1);
    res.send(customer);
})

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(customer)
}


app.listen(port,()=>{
    console.log(`Listening on ${host}:${port}...`);
})