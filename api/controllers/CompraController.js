/**
 * CompraController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  agregarCarroCompra: async (peticion, respuesta) => {
    const foto_id = peticion.params.fotoId;
    const cliente_id = peticion.session.cliente.id;
    let foto = await CarroCompra.findOne({foto: foto_id, cliente: cliente_id})
    if (foto) {
      peticion.addFlash('mensaje', 'La foto ya habia sido agregada al carro de compra')
    }
    else { 
      await CarroCompra.create({
        cliente: cliente_id,
        foto: foto_id
      })
      peticion.session.carroCompra = await CarroCompra.find({cliente: cliente_id})
      sails.log.debug(peticion.session.carroCompra)
      peticion.addFlash('mensaje', 'Foto agregada al carro de compra')
    }
    return respuesta.redirect("/")
  },

  carroCompra: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.cliente){
      return respuesta.redirect("/")
    }
    let elementos = await CarroCompra.find({cliente: peticion.session.cliente.id}).populate('foto')
    respuesta.view('pages/carro_de_compra', {elementos})
  },

  eliminarCarroCompra: async (peticion, respuesta) => {
    const foto_id = peticion.params.fotoId;
    const cliente_id = peticion.session.cliente.id;
    let foto = await CarroCompra.findOne({foto: foto_id, cliente: cliente_id})
    if (foto) {
      await CarroCompra.destroy({
        cliente: cliente_id,
        foto: foto_id
      })
      peticion.session.carroCompra = await CarroCompra.find({cliente: cliente_id})
      peticion.addFlash('mensaje', 'Foto eliminada del carro de compra')
    }
    return respuesta.redirect("/carro-de-compra")
  },

  comprar: async (peticion, respuesta) => {
    let orden = await Orden.create({
      fecha: new Date(),
      cliente: peticion.session.cliente.id,
      total: peticion.session.carroCompra.length
    }).fetch()
    for(let i=0; i< peticion.session.carroCompra.length; i++){
      await OrdenDetalle.create({
        orden: orden.id,
        foto: peticion.session.carroCompra[i].foto
      })
    }
    await CarroCompra.destroy({cliente: peticion.session.cliente.id})
    peticion.session.carroCompra = []
    peticion.addFlash('mensaje', 'La compra ha sido realizada')
    return respuesta.redirect("/")
  },

};

