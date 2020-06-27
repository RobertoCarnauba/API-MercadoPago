const express = require('express')
const app = express()
const port = 80
app.set('view engine', 'ejs');

const MercadoPago = require('mercadopago');


MercadoPago.configure({
    sandbox: true,
    access_token: "TEST-7690089461595324-062702-9ab0f06f4fb4ce1cd5add9864494f5b3-579006485"
});
app.get('/', (req, res) => {
    res.render("index");
});
app.get('/pagamento', async (req, res) => {

    var id = "" + Date.now();
    var emailDoPagador = "betocarnauba@hotmail.com"

    var dados = {
        items: [
            item = {
                id: id,
                title: "Camisa Torcedor Corithains Paulista do meu coração.",
                description: "É um facto estabelecido de que um leitor é distraído pelo.",
                category_id: "esporte",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(150)
            }
        ],
        payer: {
            email: emailDoPagador
        },
        shipments:{
			receiver_address:{
				street_name:"Av das Nacoes Unidas",
				street_number:3003,
				zip_code:"06233200",
				city_name: "Buzios",
				state_name: "Rio de Janeiro"
			}
		},
        external_reference: id
    }

    try {
        var pagamento = await MercadoPago.preferences.create(dados)
        console.log(pagamento)
        //Banco.salvarPagamento({id: id, pagador: emailDoPagador})
        return res.redirect(pagamento.body.init_point)
    } catch (error) {
        return res.send(error.message)
    }

})

app.post('/notificacao',(req, res) =>{
    var id = req.query.id

    setTimeout(() => {
        var filtro = {
            "order.id": id
        }
        MercadoPago.payment.search({
            qs:filtro
        }).then(data => {
            var pagamento = data.body.results[0]

            if(pagamento != undefined){
                console.log(pagamento)
                console.log(pagamento.external_reference)
                console.log(pagamento.status)

                if(status === "aproved"){
                    //Banco.definirComoPago(pagamento.external_reference)
                } else {
                    //conseole.log("Pagamento não existe!")
                }
            }
        }).catch(err => {
            console.log(err)
        })

    }, 20000)
})

app.listen(port, () => console.log("--> Aplication On <--"))