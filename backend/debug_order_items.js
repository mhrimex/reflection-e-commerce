
import fetch from 'node-fetch';

async function debug() {
    try {
        console.log('Fetching orders...');
        const ordersRes = await fetch('http://localhost:5000/api/orders?_t=' + Date.now());
        const orders = await ordersRes.json();
        console.log(`Found ${orders.length} orders.`);

        if (orders.length > 0) {
            // Find an order that likely has items (not just the first one)
            // Or just check the first few
            const orderToCheck = orders[0];
            const orderId = orderToCheck.id;

            console.log(`Fetching items for Order #${orderId}...`);

            const itemsRes = await fetch(`http://localhost:5000/api/orders/${orderId}?_t=` + Date.now());
            const items = await itemsRes.json();

            console.log('Items Response Status:', itemsRes.status);
            console.log('Items Body:', JSON.stringify(items, null, 2));
        } else {
            console.log('No orders to check.');
        }
    } catch (e) {
        console.error('Debug failed:', e);
    }
}

debug();
