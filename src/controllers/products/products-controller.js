import { saveProduct, getProducts, updateProductDB, deleteProductDB } from '../../repositories/products/product-repository.js'

/**
 * Crea un nuevo producto y lo guarda en la base de datos.
 *
 * @param {object} req - Objeto de solicitud de Express, que contiene los datos del producto en `req.body`.
 * @param {object} res - Objeto de respuesta de Express, utilizado para enviar la respuesta HTTP.
 * @returns {Promise<void>} - Responde con un mensaje de éxito o error.
 */
export const createProduct = async (req, res) => {
  const { productName, productDescription, productPrice, quantity, userId } = req.body
  const product = {
    productName,
    productDescription,
    productPrice,
    quantity,
    userId
  }
  try {
    await saveProduct(product)
    res.status(201).send('Product created')
  } catch (e) {
    console.error(e)
    res.status(500).send('Something went wrong')
  }
}

/**
 * Lista todos los productos disponibles en la base de datos.
 *
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express, utilizado para enviar los datos de los productos.
 * @returns {Promise<void>} - Responde con un listado de productos o un mensaje de error.
 */
export const listProducts = async (req, res) => {
  try {
    const products = await getProducts()
    res.status(200).json(products)
  } catch (e) {
    console.error(e)
    res.status(500).send('Something went wrong')
  }
}

/**
 * Actualiza la información de un producto existente en la base de datos.
 *
 * @param {object} req - Objeto de solicitud de Express, contiene los datos actualizados del producto en `req.body`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} - Responde con un mensaje de éxito o error.
 */
export const updateProduct = async (req, res) => {
  const productId = req.params.id
  console.log(productId)
  const { productName, productDescription, productPrice, quantity, userId } = req.body
  const product = {
    productName,
    productDescription,
    productPrice,
    quantity,
    userId
  }
  try {
    await updateProductDB(product, productId)
    res.status(200).send('Product updated')
  } catch (e) {
    console.error(e)
    res.status(500).send('Something went wrong')
  }
}

/**
 * Marca un producto como no disponible en la base de datos.
 *
 * @param {object} req - Objeto de solicitud de Express, que contiene el `id` del producto en `req.params`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} - Responde con un mensaje de éxito o error.
 */
export const deleteProduct = async (req, res) => {
  const productId = req.params.id
  try {
    await deleteProductDB(productId)
    res.status(200).send('Product deleted')
  } catch (e) {
    console.error(e)
    res.status(500).send('Something went wrong')
  }
}