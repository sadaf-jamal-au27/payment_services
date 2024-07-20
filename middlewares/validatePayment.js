const validatePayment = (req, res, next) => {
    const { amount } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
            error: 'Invalid amount. Amount must be a positive number.',
        });
    }

    next();
};

module.exports = validatePayment;
