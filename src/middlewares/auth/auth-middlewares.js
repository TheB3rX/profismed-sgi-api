import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../config/config.js'

/**
 * Middleware para verificar si la sesión de un usuario está activa.
 * Verifica la existencia y validez de un token JWT en las cookies de la solicitud.
 *
 * @param {object} req - Objeto de solicitud de Express, debe contener el token JWT en `req.cookies`.
 * @param {object} res - Objeto de respuesta de Express utilizado para enviar la respuesta HTTP.
 * @param {function} next - Función que permite continuar con el siguiente middleware si el token es válido.
 * @returns {Promise<void>} - Si el token es válido, continúa a la siguiente función, de lo contrario responde con un estado 401.
 */
export const isSessionActive = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded) {
      next()
    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  } catch (e) {
    console.error(e)
    res.status(401).json({ message: 'Unauthorized' })
  }
}

/**
 * Middleware para verificar si el usuario es administrador.
 * Verifica la existencia y validez de un token JWT en las cookies de la solicitud y si el usuario tiene rol de administrador.
 *
 * @param {object} req - Objeto de solicitud de Express, debe contener el token JWT en `req.cookies`.
 * @param {object} res - Objeto de respuesta de Express utilizado para enviar la respuesta HTTP.
 * @param {function} next - Función que permite continuar con el siguiente middleware si el token es válido y el usuario es administrador.
 * @returns {Promise<void>} - Si el token es válido y el usuario es administrador, continúa a la siguiente función, de lo contrario responde con un estado 401.
 */
export const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded && decoded.roleId === 1) {
      next()
    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  } catch (e) {
    console.error(e)
    res.status(401).json({ message: 'Unauthorized' })
  }
}
