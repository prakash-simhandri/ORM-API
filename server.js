const express = require('express');
const Sequelize = require("sequelize");
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const connection = new Sequelize(process.env.PORJ_NAME, process.env.DB_USER, process.env.DB_PASS, {
    dialect: process.env.DIALECT
});
const User = connection.define('user', {
    name: Sequelize.STRING,
    state: Sequelize.STRING,
    age: Sequelize.INTEGER
})
connection.sync()
.then(() =>{
    console.log({"Success": "users table created successfully...."})
})
.catch((err) =>{
    console.log(err)
    console.log({"Error": "Please, check your query.....!"})
})

app.post("/insert_data",(req,res)=>{
    const {name, state, age} = req.body;
    User.create({
        name:name,
        state:state,
        age:age
    }).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

app.get("/all_data",(req,res)=>{
    User.findAll().then((result)=>{
        res.send(result)
    }).catch((reject)=>{
        res.send(reject)
    })
})

app.get("/user/:id",(req,res)=>{
    const user_id = req.params.id;
    User.findOne({where:{id:user_id}}).then((result)=>{
        if(result == null){
            res.send({"Error":"this user id not available.."})
        }
        res.send(result)
    }).catch((reject)=>{
        res.send(reject)
    })
})

app.put("/user_editing/:id",(req,res)=>{
    const user_id = req.params.id;
    const {name,state,age} = req.body;
    User.findOne({where:{id:user_id}}).then((result)=>{
        if(result == null){
            res.send({"Error":"this user id not available.."})
        }else{
            console.log(result)
            result.update({
                name:name,
                state:state,
                age:age
            }).then((data)=>{
                res.send("data is update...")
            }).catch((err)=>{
                res.send(err)
            })
        }
    }).catch((reject)=>{
        res.send(reject)
    })
})

app.delete("/user_delete/:id",(req,res)=>{
    const user_id =  req.params.id;
    User.findOne({where:{id:user_id}}).then((result)=>{
        if (result == null) {
            res.send({"Error":"this user id not available.."})
        }else{
            result.destroy({}).then((data)=>{
                res.send(data,"this account is deleted...")
            }).catch((err)=>{
                res.send(err)
            })
        }
    }).catch((reject)=>{
        res.send(reject)
    })
})


var server = app.listen(process.env.PORT || 3020, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Server is running on port.....")
    console.log( host, port);
})
