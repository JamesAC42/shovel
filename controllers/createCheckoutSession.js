const getUserFromUsername = require("../repositories/getUserFromUsername");

const createCheckoutSession = async (req, res, stripe, models, redisClient) => {

    const username = req.session.user?.username;
    if(!username) {
        return res.status(400).send({ success: false, message: "Invalid session." });
    }
    const user = await getUserFromUsername(models, username);
    if(user.tier === 2) {
        return res.status(400).send({ success: false, message: "User already premium." });
    }

    // Real price: price_1PhnRwDrQKhh7vW7lbm2x6xb
    // Test price: price_1Q3SL5DrQKhh7vW7cumOCzFZ
    try {
        // Check if user has had a free trial before
        const hadFreeTrial = await new Promise((resolve, reject) => {
            redisClient.sismember('shovel:free_trial_users', user.id, (err, reply) => {
                if (err) reject(err);
                resolve(reply === 1);
            });
        });

        let sessionOptions = {
            mode: 'subscription',
            line_items: [
                {
                    price: "price_1PhnRwDrQKhh7vW7lbm2x6xb",
                    quantity: 1,
                },
            ],
            client_reference_id: user.id,
            success_url: 'https://ovel.sh/paymentSuccess',
            cancel_url: 'https://ovel.sh/paymentFailed',
            automatic_tax: {enabled: true},
            metadata: {
                client_reference_id: user.id
            }
        };

        if (!hadFreeTrial) {
            sessionOptions.subscription_data = {
                trial_period_days: 7,
                trial_settings: {
                    end_behavior: {
                        missing_payment_method: 'cancel',
                    }
                }
            };
        }

        const session = await stripe.checkout.sessions.create(sessionOptions);
        res.json({success: true, url: session.url});
    } catch(err) {
        console.error(err);
        res.status(400).json({success: false});
    }


}

module.exports = createCheckoutSession;