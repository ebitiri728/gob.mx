const express = require("express");
const mongoose = require("mongoose");
const helmet = require('helmet')
const mailer = require("nodemailer")
const cors = require("cors")


//mongodb
mongoose.connect("" || process.env.MONGO_DB || "mongodb://localhost:27017/teste", {useNewUrlParser: true, useUnifiedTopology: true})

let codesS = new mongoose.Schema({
    name: String,
    key: String,
    user: mongoose.Types.ObjectId
}, {versionKey: false})
let usersS = new mongoose.Schema({
    email: String,
    key: String,
    my: Array, 
    other: Array
}, {versionKey: false})

const users = mongoose.model('users', usersS)
const codes = mongoose.model('codes', codesS)


//mailer
const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: "servicedd544@gmail.com",
        pass: "mymailbot"
    }
})

//express init
let port = 3000 || process.env.PORT
const app = express()
app.use(helmet())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.set('trust proxy', true)
app.use(cors())


//auth protection
app.use((req, res, next) => {
    let json = req.body
    req.err = false
    if (json['name'] !== undefined) {
        if(json['name'].length > 5) {
            res.json({status: 'name to long(over 5 characters)'})
            req.err = true
        }
    }
    if (json['email'] !== undefined) {
        if (json['email'].includes("@") == false || json['email'].includes(".") == false || json['email'].length < 9) {
            res.json({status: 'email invalid'})
            req.err = true
        }
    }
    next()
})


//function valley
function gen(length, interval = 0) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$&';
    var charactersLength = characters.length;
    if (interval == 0 || interval == 1 || interval == 2) {
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    } else {
        length = length + (length / interval - 1)
        interval +=1
        for ( var i = 1; i < length + 1; i++ ) {
            if(i%interval == 0) {
                result += "-"
            } else {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
        }
    }
    return result;
}

async function codegen(res, doc, json, name = gen(5)) {
    while (1) {
        let key = gen(64)
        let docKey = await codes.findOne({name: name, key: key})
        if(!docKey) {
            res.json({status: 1, code: name + '|' + key})
            let newCode = new codes({name: name, key: key, user: doc['_id']})
            newCode.save()
            users.findOneAndUpdate({key: json['verify']}, {"$push": {my: name + "|" + key }}, {new: true, useFindAndModify: false}, (err) => {
                if (err) {console.log(err)}
            })
            break
        } else {
            name = gen(5)
        }
    }
}

async function newUserReg(json, res) {
    while (1) {
        let newUserKey = gen(20, 5)
        let docUser = await users.findOne({key: newUserKey})
        if (docUser == undefined) {
            let newUser = new users({email: json['email'], key: newUserKey})
            newUser.save().catch(err => console.log(err))
            res.json({status: 1})
            let mailContents = {
                from: "",
                to: json['email'],
                subject: "Yout registration code",
                text: "You have successfuly registered to ShadowBrowser. \n Here is your login key/code " + newUserKey
            }
            transporter.sendMail(mailContents, (err, info) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info.response)
                }
            })
            break
        }
    }
}


//app routes
app.post("/api/:id" , (req, res) => {
    let {id} = req.params
    let json = req.body
    console.log(id, json)
    if (req.err == false) {
        switch (id) {
            case "code":
                users.findOne({key: json['verify']}).then(doc => {
                    if (doc == undefined) {
                        res.json({status: 'invalid user'})
                    } else if (doc['my'].length >= 5) {
                        res.json({status: 'You can own only 5 codes!!!!!'})
                    } else {
                        if (json['name'] == '') {
                            codegen(res, doc, json)
                        } else {
                            codes.findOne({name: json['name']}).then(docKey => {
                                if(!docKey) {
                                    codegen(res, doc, json, json['name'])
                                } else {
                                    res.json({status: 'name in use'})
                                }
                            })
                        }
                    }
                })
                break
            case "verify":
                users.findOne({key: json['verify']}).then(doc => {
                    if (!doc) {
                        res.json({status: 'invalid user'})
                    } else if (doc['other'].length > 100) {
                        res.json({status: 'You can only have 100 codes'})
                    } else {
                        codes.findOne({name: json['code'], key: json['key']}).then(docKey => {
                            if (!docKey) {
                                res.json({status: "The code is not valid"})
                            } else {
                                if (String(doc['_id']) == String(docKey['user'])) {
                                    if (doc['my'].includes(docKey['name'] + "|" + docKey['key']) == false) {
                                        users.findOneAndUpdate({key: json['verify']}, {"$push": {my: docKey['name'] + "|" + docKey['key'] }}, {new: true, useFindAndModify: false}, (err) => {
                                            if (err) {console.log(err)}
                                        })
                                    }
                                } else {
                                    users.findOneAndUpdate({key: json['verify']}, {"$push": {other: docKey['name'] + "|" + docKey['key'] }}, {new: true, useFindAndModify: false}, (err) => {
                                        if (err) {console.log(err)}
                                    })
                                }
                                res.json({status: 1})
                            }
                        })
                    }
                })
                break
            case "del":
                users.findOne({key: json['verify']}).then(doc => {
                    if(!doc) {
                        res.json({status: 'invalid user'})
                    } else {
                        codes.findOne({name: json['code']}).then(docKey => {
                            if (!docKey) {
                                res.json({status: "Code dose not exist"})
                            } else if (doc['my'].includes(docKey['name']+"|"+docKey['key'])) {
                                codes.deleteMany({name: json['code']}, (err) => {
                                    if (err) throw err
                                })
                                users.findOneAndUpdate({key: doc['key']}, {"$pullAll": {my: [docKey['name']+"|"+docKey['key']]}}, {new: true, useFindAndModify: false}, (err, m) => {
                                    if (err) throw err
                                })
                                res.json({status: 1})
                            } else if (doc['other'].includes(docKey['name']+"|"+docKey['key'])) {
                                users.findOneAndUpdate({key: doc['key']}, {"$pullAll": {other: [docKey['name']+"|"+docKey['key']]}}, {new: true, useFindAndModify: false}, (err, m) => {
                                    if (err) {console.log(err)}
                                })
                                res.json({status: 1})
                            } else {
                                res.json({status: "Not your key"})
                            }
                        })
                    }
                })
                break
            case 'reg':
                users.findOne({email: json['email']}).then(doc => {
                    if (!doc) {
                        newUserReg(json, res)
                    } else {
                        let mailContents = {
                            from: "",
                            to: json['email'],
                            subject: "Your code to login",
                            text: "A user requester to to login via this email \n Here is the login code \n ----------//////" + doc['key'] + "\\\\\\----------"
                        }
                        transporter.sendMail(mailContents, (err, info) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(info.response)
                            }
                        })
                        res.json({status: 1})
                    }
                })
                break
            case "log":
                users.findOne({key: json['key']}).then(doc => {
                    if (!doc) {
                        res.json({status: "The user dose not exist!!!!"})
                    } else {
                        res.json({status: 1, my: doc['my'], other: doc['other']})
                    }
                })
                break
        }
    }
})

app.listen(port, () => console.log("Server online, port:" + port))