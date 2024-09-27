async function handleWebhook(request, response, stripe, stripeLogin, datamodels) {

    const sig = request.headers['stripe-signature'];

    let event;
  
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, stripeLogin.webhookSecret);
    } catch (err) {
        console.log(err);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
  
    let subscription;
    let session = event.data.object;
    let user;
  
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            // Payment is successful and the subscription is created.
            // You should provision the subscription and save the customer ID to your database.
            user = session.metadata.client_reference_id;
            if(!user) return;

            if (session.mode === 'subscription') {
                await stripe.subscriptions.update(session.subscription, {
                    metadata: {
                        client_reference_id: user
                    }
                });
                
                await datamodels.User.update({ tier: 2 }, { where: { id: user } });
            }

            break;

        case 'invoice.paid':
            subscription = await stripe.subscriptions.retrieve(session.subscription);
            user = subscription.metadata.client_reference_id;
            if(user) {
                await datamodels.User.update({ tier: 2 }, { where: { id: user } });
            } 
            break;
        
        case 'invoice.payment_failed':
            // The payment failed or the customer does not have a valid payment method.
            // The subscription becomes past_due. Notify your customer and send them to the
            // customer portal to update their payment information.
    
            subscription = await stripe.subscriptions.retrieve(session.subscription);
            user = subscription.metadata.client_reference_id;
            
            if (user) {
                await datamodels.User.update({ tier: 1 }, { where: { id: user } });
            }

            break;
            
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();

}

module.exports = handleWebhook;