import { useEffect, useState } from 'react';

function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Read ?items=p1,p2 from URL
    const params = new URLSearchParams(window.location.search);
    const itemsRaw = params.get('items');

    if (itemsRaw) {
      const ids = itemsRaw.split(',');
      setCart(ids);
      localStorage.setItem('cart', JSON.stringify(ids)); // Persist
      alert(`✅ ${ids.length} items added to cart!`);
    }
  }, []);

  return (
    <div>
      <h1>Sahar's Shop</h1>
      <p>Cart Status: {cart.length > 0 ? `${cart.length} items` : 'Empty'}</p>
    </div>
  );
}
export default App;