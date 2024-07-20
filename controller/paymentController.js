//console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const logger = require('../config/logger');

exports.createPaymentIntent = async (req, res, next) => {
    const { amount, payment_method, user_id } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });

        const payment = new Payment({
            payment_id: paymentIntent.id,
            user_id,
            amount,
            currency: 'usd',
            status: 'created',
            payment_method,
            created_at: new Date(),
            updated_at: new Date()
        });

        await payment.save();

        res.status(200).send({
            payment_id: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        logger.error(`Error creating payment intent: ${error.message}`);
        next(error);
    }
};

exports.processPayment = async (req, res, next) => {
    const { payment_id, payment_method_details } = req.body;

    try {
        const payment = await Payment.findOne({ payment_id });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        if (payment.status !== 'created') {
            return res.status(400).json({ error: 'Payment already processed' });
        }

        // Here you would typically call Stripe's API to process the payment method details
        // For simplicity, we'll assume the payment is processed successfully

        payment.status = 'processed';
        payment.updated_at = new Date();

        await payment.save();

        res.status(200).send({ status: 'processed' });
    } catch (error) {
        logger.error(`Error processing payment: ${error.message}`);
        next(error);
    }
};

exports.getPaymentStatus = async (req, res, next) => {
    const { payment_id } = req.params;

    try {
        const payment = await Payment.findOne({ payment_id });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.status(200).send({
            payment_id: payment.payment_id,
            status: payment.status,
        });
    } catch (error) {
        logger.error(`Error retrieving payment status: ${error.message}`);
        next(error);
    }
};

exports.refundPayment = async (req, res, next) => {
    const { payment_id } = req.params;

    try {
        const payment = await Payment.findOne({ payment_id });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        if (payment.status !== 'processed') {
            return res.status(400).json({ error: 'Only processed payments can be refunded' });
        }

        const refund = await stripe.refunds.create({
            payment_intent: payment_id,
        });

        payment.status = 'refunded';
        payment.updated_at = new Date();

        await payment.save();

        res.status(200).send({
            payment_id: payment.payment_id,
            status: payment.status,
        });
    } catch (error) {
        logger.error(`Error refunding payment: ${error.message}`);
        next(error);
    }
};
