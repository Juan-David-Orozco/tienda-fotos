/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

 module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // -- Contenido estatico -- //
  '/acerca-de': {view: 'pages/acerca_de'},

  // -----       Controlador Principal       ---- //
  'GET /': 'PrincipalController.inicio',
  'GET /top-vendidas': 'PrincipalController.topVendidas',

  // -----       Controlador Sesion Cliente       ---- //
  'GET /registro': 'SesionController.registro',
  'POST /procesar-registro': 'SesionController.procesarRegistro',

  'GET /inicio-sesion': 'SesionController.inicioSesion',
  'GET /cerrar-sesion': 'SesionController.cerrarSesion',
  'POST /procesar-inicio-sesion': 'SesionController.procesarInicioSesion',

  // -----       Controlador Compra       ---- //
  'GET /agregar-carro-compra/:fotoId': 'CompraController.agregarCarroCompra',
  'GET /carro-de-compra': 'CompraController.carroCompra',
  'GET /eliminar-carro-compra/:fotoId': 'CompraController.eliminarCarroCompra',
  'GET /comprar': 'CompraController.comprar',
  
  'GET /mis-ordenes': 'CompraController.misOrdenes',
  'GET /mis-ordenes/:ordenId': 'CompraController.ordenDeCompra',

  'GET /agregar-lista-deseo/:fotoId': 'CompraController.agregarListaDeseo',
  'GET /lista-deseo': 'CompraController.listaDeseo',
  'GET /eliminar-lista-deseo/:fotoId': 'CompraController.eliminarListaDeseo',

  /* ======     Controlador Administrador    ===== */
  // Principal
  'GET /admin/principal': 'AdminController.principal',
  // Sesion
  'GET /admin/inicio-sesion': 'AdminController.inicioSesion',
  'POST /admin/procesar-inicio-sesion': 'AdminController.procesarInicioSesion',
  'GET /admin/cerrar-sesion': 'AdminController.cerrarSesion',
  // Activacion-Desactivacion Fotos
  'GET /admin/desactivar-foto/:fotoId': 'AdminController.desactivarFoto',
  'GET /admin/activar-foto/:fotoId': 'AdminController.activarFoto',
  // Agregar Foto
  'GET /admin/agregar-foto': 'AdminController.agregarFoto',
  'POST /admin/procesar-agregar-foto': 'AdminController.procesarAgregarFoto',
  // Clientes
  'GET /admin/clientes': 'AdminController.clientes',
  'GET /admin/clientes/:clienteId': 'AdminController.ordenesClientes',
  'GET /admin/fotos-ordenes/:ordenId': 'AdminController.fotosOrdenes',
  'GET /admin/desactivar-cliente/:clienteId': 'AdminController.desactivarCliente',
  'GET /admin/activar-cliente/:clienteId': 'AdminController.activarCliente',
  // Administradores
  'GET /admin/administradores': 'AdminController.administradores',
  'GET /admin/desactivar-admin/:adminId': 'AdminController.desactivarAdmin',
  'GET /admin/activar-admin/:adminId': 'AdminController.activarAdmin',
  // Dashboard
  'GET /admin/dashboard': 'AdminController.dashboard',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝



  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
