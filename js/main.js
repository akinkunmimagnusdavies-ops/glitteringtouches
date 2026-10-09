document.getElementById('year').innerText = new Date().getFullYear();

// 1. MOBILE NAV TOGGLE - Fixed
function toggleMenu(){
  const nav = document.getElementById('navLinks');
  nav.classList.toggle('active');
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('active');
  });
});

// 2. LOCATION + SERVICE PRICE LOGIC
const baseServices = [
  { label: "Simple Makeup", price: 10000 },
  { label: "Casual Nude Look", price: 10000 },
  { label: "Full Face Beat with Mink Lashes", price: 15000 },
  { label: "Complete Package", price: 18000 }
];

const serviceSelect = document.getElementById('service');
const locationRadios = document.querySelectorAll('input[name="location"]');

function renderServices() {
  const loc = document.querySelector('input[name="location"]:checked').value;
  const extra = loc === 'outside' ? 10000 : 0;
  serviceSelect.innerHTML = '<option value="">Select Service</option>';
  baseServices.forEach(s => {
    const newPrice = s.price + extra;
    const option = document.createElement('option');
    option.value = `${s.label} - ₦${newPrice.toLocaleString()} (${loc})`;
    option.textContent = `${s.label} - ₦${newPrice.toLocaleString()}`;
    serviceSelect.appendChild(option);
  });
}
locationRadios.forEach(r => r.addEventListener('change', renderServices));
renderServices(); // initial render

// 3. CART LOGIC
// 3. CART LOGIC - FIXED
let cart = JSON.parse(localStorage.getItem('lawlahCart')) || [];
const cartCount = document.getElementById('cartCount');
const cartBox = document.getElementById('cartBox');
const cartItemsDiv = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');

function updateCartUI(){
  // ALWAYS save first
  localStorage.setItem('lawlahCart', JSON.stringify(cart));
  
  cartCount.innerText = cart.reduce((sum,i)=>sum+i.qty,0);
  
  if(cart.length===0){ 
    cartBox.style.display='none'; 
    cartItemsDiv.innerHTML = '';
    cartTotalSpan.innerText = '0';
    cartCount.innerText = '0';
    return; 
  }
  
  cartBox.style.display='block';
  cartItemsDiv.innerHTML = cart.map(c => `${c.name} x${c.qty} = ₦${(c.price*c.qty).toLocaleString()} <button onclick="removeFromCart(${c.id})" style="margin-left:8px;color:red;border:none;background:none;cursor:pointer">remove</button>`).join('<br>');
  const total = cart.reduce((sum,i)=>sum+i.price*i.qty,0);
  cartTotalSpan.innerText = total.toLocaleString();
  
  const waText = `Hi GLITTERING TOUCHES, I am placing an order for:\n${cart.map(c=>`- ${c.name} x${c.qty}`).join('\n')}\nTotal: ₦${total.toLocaleString()}`;
  document.getElementById('checkoutWA').href = `https://wa.me/2349156002887?text=${encodeURIComponent(waText)}`;
}

function removeFromCart(id){ 
  cart = cart.filter(c=>c.id!=id); 
  updateCartUI(); 
}

document.querySelectorAll('.card').forEach(card=>{
  const btn = card.querySelector('.ATC');
  btn.addEventListener('click', ()=>{
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    const found = cart.find(c=>c.id==id);
    if(found) found.qty++; else cart.push({id, name, price, qty:1});
    btn.innerText = "Added ✓"; setTimeout(()=>btn.innerText="Add to Cart",1000);
    updateCartUI();
  });
});
updateCartUI();

// 4. Booking form submit + WhatsApp autofill
const form = document.getElementById('bookingForm');
const formStatus = document.getElementById('formStatus');
form.addEventListener("submit", async (e) => {
e.preventDefault();
let btn = document.getElementById('bookBtn');
btn.textContent = "Sending..."; btn.disabled = true;
formStatus.style.display = "block"; formStatus.textContent = "Sending your booking...";
try {
   let data = new FormData(form);
   let res = await fetch(form.action, {method:'POST', body:data, headers:{'Accept':'application/json'}});
   if(res.ok){
     formStatus.style.color = "#00ff88"; formStatus.textContent = "✅ Booking sent! We will contact you shortly.";
     form.reset(); renderServices();
   } else {
     formStatus.style.color = "red"; formStatus.textContent = "❌ Failed. Try WhatsApp: 09156002887";
   }
} catch(err) {
   formStatus.style.color = "red"; formStatus.textContent = "❌ Network error. WhatsApp us: 09156002887";
}
btn.textContent = "Book Now"; btn.disabled = false;
});

document.getElementById('waDirect').addEventListener('click', function(){
  let name = document.getElementById('name').value || "Someone";
  let service = document.getElementById('service').value || "makeup service";
  let address = document.getElementById('address').value || "";
  let loc = document.querySelector('input[name="location"]:checked').value;
  let text = `Hi GLITTERING TOUCHES! I'm ${name} from ${address} (${loc}), I want to book ${service}.`;
  this.href = `https://wa.me/2349156002887?text=${encodeURIComponent(text)}`;
});