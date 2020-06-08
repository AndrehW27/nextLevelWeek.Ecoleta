// const express = require("express")
// const server = express()


// //Pegar o banco de dados

// const db = require("./database/db")

// // configuirar a pasta publica
// server.use(express.static("public"))

// //habilitar o uso do req.body na nossa aplicação
// server.use(express.urlencoded({ extended: true }))


// //utilizando template engine
// const nunjucks = require("nunjucks")
// nunjucks.configure("src/views", {
//     express: server,
//     noCache: true
// })


// //configurar caminhos da minha aplicação
// //página inicial
// //req: requisição
// //res: resposta

// server.get("/", (req, res) => {
//     return res.render("index.html", { tittle: "Um Título" })
// })


// server.get("/create-point", (req, res) => {
//     //req.query: Query Strings da nossa URL
//     // console.log(req.query)

//     return res.render("create-point.html")
// })

// server.post("/savepoint", (req, res) => {
   

//     //req.body: O corpo do nosso formulário
//     // console.log(req.body)

//     //inserir dados no banco de dados   
//     const query = `
//         INSERT INTO places (
//             image,
//             name,
//             address,
//             address2,
//             state,
//             city,
//             items
//         ) VALUES (?,?,?,?,?,?,?);
//     `

//     const values = [
//       req.body.image,
//       req.body.name,
//       req.body.address,
//       req.body.address2,
//       req.body.state,
//       req.body.city,
//       req.body.items
      
//     ] 

//     function afterInsertData (err) {
//         if(err) {
//             console.log(err)
//             return res.send("Erro no Cadastro!")
//         }

//         console.log("Cadastro com sucesso!")
//         console.log(this)   
        
//         return res.render("create-point.html", {saved: true})
//     }

//     db.run(query, values, afterInsertData)
   
    
// })




// server.get("/search", (req, res) => {

//     const search = req.query.search

//     if(search == "") {
//     //pesquisa vazia
//     return res.render("search-results.html", {total: 0})
//     }



//     //Pegar os dados do banco de dados
//     db.all(`SELECT* FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
//         if(err) {
//             return console.log(err)
//         }

//         // console.log("Aqui estão os seus registros")
//         // console.log(rows)


//         const total = rows.length

//         //Mostrar a pagina html com os dados do banco de dados
//             return res.render("search-results.html", { places: rows, total: total})
//     })   

// })


// //ligar o servidor
// server.listen(3000)


const express = require("express")
const server = express()

const PORT = process.env.PORT || 3000

const db = require("./database/db.js")

server.use(express.static("public"))
server.use(express.urlencoded({extended: true}))

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) 
    VALUES (?,?,?,?,?,?,?);`

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err){
            return console.log(err)
        }
        console.log("Cadastrado com sucesso")
        console.log(this)
        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)
})

server.get("/search", (req, res) => {

    const search = req.query.search
    if(search == ""){
        return res.render("search-results.html",{total: 0})
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err){
            console.log(err)
            return res.render("search-results.html",{total: 0})
        }
        const total = rows.length
        return res.render("search-results.html",{places: rows, total: total})
    })
})

server.listen(PORT)