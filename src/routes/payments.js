const express = require('express');
const router = express.Router();
const paymentRoutes = require('../controller/paymentController');
const validatePayment = require('../middlewares/validatePayment');

/**
 * @swagger
 * /payments/create:
 *   post:
 *     summary: Create a payment intent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: The amount to charge in cents
 *                 example: 2000
 *               payment_method:
 *                 type: string
 *                 description: The payment method
 *                 example: "credit_card"
 *               user_id:
 *                 type: string
 *                 description: The user ID
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment_id:
 *                   type: string
 *                   description: The payment ID
 *                   example: "payment123"
 *                 clientSecret:
 *                   type: string
 *                   description: The client secret of the payment intent
 *                   example: "secret_12345"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/create', validatePayment, paymentRoutes.createPaymentIntent);

/**
 * @swagger
 * /payments/process:
 *   post:
 *     summary: Process a payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_id:
 *                 type: string
 *                 description: The payment ID
 *                 example: "payment123"
 *               payment_method_details:
 *                 type: object
 *                 description: Details of the payment method
 *                 example: { ... }
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/process', paymentRoutes.processPayment);

/**
 * @swagger
 * /payments/{payment_id}/status:
 *   get:
 *     summary: Retrieve the status of a payment
 *     parameters:
 *       - in: path
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment_id:
 *                   type: string
 *                   description: The payment ID
 *                   example: "payment123"
 *                 status:
 *                   type: string
 *                   description: The status of the payment
 *                   example: "processed"
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.get('/:payment_id/status', paymentRoutes.getPaymentStatus);

/**
 * @swagger
 * /payments/{payment_id}/refund:
 *   post:
 *     summary: Handle a refund for a payment
 *     parameters:
 *       - in: path
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.post('/:payment_id/refund', paymentRoutes.refundPayment);

module.exports = router;
