/*
 * AFRIXA × RUDIS GADGET WORLD — demo storefront
 * This is a front-end concept. No payment gateway or live inventory is connected.
 * Before launch, replace demo products and connect the business's verified WhatsApp number.
 */
const STORE_CONFIG = {
  name: "Rudis Gadget World",
  whatsappNumber: "254783809340", // Demo routing to founder number; replace with Rudis official number after approval.
};

const products = [
  {id:"phone-01",name:"Smartphone",category:"Phones",description:"Explore models, storage options and available colours.",image:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",alt:"Illustrative smartphone",tag:"MOBILE"},
  {id:"audio-01",name:"Wireless earbuds",category:"Audio",description:"Ask about sound, battery life and device compatibility.",image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",alt:"Illustrative wireless earbuds",tag:"AUDIO"},
  {id:"wear-01",name:"Smartwatch",category:"Wearables",description:"Compare styles, features and compatible devices.",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",alt:"Illustrative smartwatch",tag:"WEARABLE"},
  {id:"audio-02",name:"Bluetooth speaker",category:"Audio",description:"Find out about size, sound output and connectivity.",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",alt:"Illustrative Bluetooth speaker",tag:"SOUND"},
  {id:"power-01",name:"Power bank",category:"Power",description:"Check capacity, charging speed and supported devices.",image:"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80",alt:"Illustrative power bank",tag:"POWER"},
  {id:"compute-01",name:"Laptop",category:"Computing",description:"Ask about processor, memory, storage and condition.",image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",alt:"Illustrative laptop",tag:"COMPUTING"}
];

const state = {category:"All",query:"",bag:new Map(),lastMessage:""};
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const productGrid = $("#productGrid");
const emptyState = $("#emptyState");
const overlay = $("#overlay");
const bagDrawer = $("#bagDrawer");
const enquiryModal = $("#enquiryModal");
let toastTimer;

function escapeHTML(value){return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
function filteredProducts(){
  const q = state.query.trim().toLowerCase();
  return products.filter(product => (state.category === "All" || product.category === state.category) && (!q || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(q)));
}
function renderProducts(){
  const visible = filteredProducts();
  $("#resultCount").textContent = String(visible.length).padStart(2,"0");
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${escapeHTML(product.alt)}" loading="lazy" onerror="this.style.opacity='.0';this.parentElement.style.background='linear-gradient(135deg,#e7edf3,#d8e9ee)'" />
        <span class="product-tag">${escapeHTML(product.tag)} · DEMO</span>
        <button class="quick-add" data-add="${product.id}" aria-label="Add ${escapeHTML(product.name)} to enquiry list">＋</button>
      </div>
      <div class="product-info">
        <span class="product-category">${escapeHTML(product.category)}</span>
        <h3>${escapeHTML(product.name)}</h3>
        <p class="product-description">${escapeHTML(product.description)}</p>
        <div class="product-meta"><span class="price-prompt">Ask for price<small>Confirm current availability</small></span><button class="product-enquire" data-add="${product.id}">Enquire ↗</button></div>
      </div>
    </article>`).join("");
  emptyState.hidden = visible.length !== 0;
  productGrid.hidden = visible.length === 0;
}
function showToast(message){
  const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function setCategory(category){
  state.category=category;
  $$(".category-pill").forEach(btn=>btn.classList.toggle("selected",btn.dataset.category===category));
  renderProducts();
}
function addToBag(id){
  if(!products.some(product=>product.id===id))return;
  state.bag.set(id,(state.bag.get(id)||0)+1);renderBag();showToast("Added to your enquiry list");
  if(window.matchMedia("(max-width: 720px)").matches)$("#mobileEnquiryBar").classList.add("visible");
}
function changeQuantity(id,delta){
  const next=(state.bag.get(id)||0)+delta;
  if(next<=0)state.bag.delete(id);else state.bag.set(id,next);
  renderBag();
}
function renderBag(){
  const entries=[...state.bag.entries()];
  const count=entries.reduce((sum,[,qty])=>sum+qty,0);
  $("#bagCount").textContent=count;$("#drawerCount").textContent=`(${count})`;
  $("#mobileBagCount").textContent=count;
  $("#bagItems").innerHTML=entries.map(([id,qty])=>{
    const p=products.find(item=>item.id===id);if(!p)return "";
    return `<div class="bag-row"><img src="${p.image}" alt="" /><div><h3>${escapeHTML(p.name)}</h3><small>${escapeHTML(p.category)} · Price to confirm</small><div class="qty-control"><button data-qty="${id}" data-delta="-1" aria-label="Remove one ${escapeHTML(p.name)}">−</button><span>${qty}</span><button data-qty="${id}" data-delta="1" aria-label="Add one ${escapeHTML(p.name)}">＋</button></div></div><button class="remove-item" data-remove="${id}" aria-label="Remove ${escapeHTML(p.name)}">×</button></div>`;
  }).join("");
  $("#bagEmpty").hidden=count>0;$("#drawerBottom").hidden=count===0;
  $("#mobileEnquiryBar").classList.toggle("visible",count>0 && window.matchMedia("(max-width: 720px)").matches);
}
function openDrawer(){
  overlay.hidden=false;bagDrawer.classList.add("open");bagDrawer.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeLayers(){
  overlay.hidden=true;bagDrawer.classList.remove("open");bagDrawer.setAttribute("aria-hidden","true");enquiryModal.hidden=true;enquiryModal.classList.remove("show");document.body.style.overflow="";
}
function selectedSummary(){
  const entries=[...state.bag.entries()];
  if(!entries.length)return "No products selected yet. You can still ask a general question.";
  return `<strong>Products selected:</strong><br>${entries.map(([id,qty])=>{const p=products.find(item=>item.id===id);return `${qty} × ${escapeHTML(p.name)} (${escapeHTML(p.category)})`;}).join("<br>")}<br><span>Prices and availability to be confirmed by the shop.</span>`;
}
function openEnquiry(){
  $("#enquirySummary").innerHTML=selectedSummary();
  $("#enquiryForm").hidden=false;$("#copyResult").hidden=true;
  enquiryModal.hidden=false;overlay.hidden=false;requestAnimationFrame(()=>enquiryModal.classList.add("show"));document.body.style.overflow="hidden";
}
function buildMessage(form){
  const data=new FormData(form);
  const entries=[...state.bag.entries()];
  const lines=entries.length?entries.map(([id,qty])=>{const p=products.find(item=>item.id===id);return `• ${p.name} — quantity ${qty}`;}):["• I would like help choosing a suitable gadget."];
  return [
    `Hello ${STORE_CONFIG.name},`,
    "I found your shop through the Afrixa online catalogue and would like to make an enquiry.",
    "", "PRODUCTS:", ...lines,
    "", `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Area: ${data.get("location")||"Not specified"}`,
    `Question / preference: ${data.get("notes")||"Please share current price, availability and details."}`,
    "", "Please confirm the current price, exact model, availability, warranty/return terms, delivery fee and payment method before I order. Thank you."
  ].join("\n");
}
async function copyText(text){
  try{await navigator.clipboard.writeText(text);return true;}
  catch(error){
    const area=document.createElement("textarea");area.value=text;area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();
    let ok=false;try{ok=document.execCommand("copy");}catch(e){ok=false;}area.remove();return ok;
  }
}

productGrid.addEventListener("click",event=>{const button=event.target.closest("[data-add]");if(button)addToBag(button.dataset.add);});
$("#categoryPills").addEventListener("click",event=>{const button=event.target.closest("[data-category]");if(button)setCategory(button.dataset.category);});
$("#productSearch").addEventListener("input",event=>{state.query=event.target.value;renderProducts();});
$("#focusSearch").addEventListener("click",()=>{$("#productSearch").focus();$("#shop").scrollIntoView({behavior:"smooth"});});
$("#clearFilters").addEventListener("click",()=>{state.query="";$("#productSearch").value="";setCategory("All");});
$$("[data-jump-category]").forEach(button=>button.addEventListener("click",()=>{setCategory(button.dataset.jumpCategory);$("#shop").scrollIntoView({behavior:"smooth"});}));
$("#openBag").addEventListener("click",openDrawer);$("#mobileOpenBag").addEventListener("click",openDrawer);
$("#closeBag").addEventListener("click",closeLayers);$("#continueShopping").addEventListener("click",()=>{closeLayers();$("#shop").scrollIntoView({behavior:"smooth"});});
$("#bagItems").addEventListener("click",event=>{
  const qty=event.target.closest("[data-qty]");const remove=event.target.closest("[data-remove]");
  if(qty)changeQuantity(qty.dataset.qty,Number(qty.dataset.delta));
  if(remove){state.bag.delete(remove.dataset.remove);renderBag();}
});
$("#startEnquiry").addEventListener("click",openEnquiry);
$("#contactEnquiry").addEventListener("click",()=>{closeLayers();openEnquiry();});
$("#closeEnquiry").addEventListener("click",closeLayers);overlay.addEventListener("click",closeLayers);
$("#enquiryForm").addEventListener("submit",async event=>{
  event.preventDefault();
  const form=event.currentTarget;state.lastMessage=buildMessage(form);
  const number=STORE_CONFIG.whatsappNumber.replace(/\D/g,"");
  let whatsappOpened=false;
  // Open WhatsApp synchronously inside the user's submit action, before awaiting clipboard access.
  if(number.length>=10){
    const chat=window.open(`https://wa.me/${number}?text=${encodeURIComponent(state.lastMessage)}`,"_blank","noopener,noreferrer");
    whatsappOpened=Boolean(chat);
  }
  const copied=await copyText(state.lastMessage);
  if(whatsappOpened){
    $("#copyResultText").textContent="Your WhatsApp message is ready in a new tab. Review it and tap send.";
  }else if(STORE_CONFIG.whatsappNumber){
    $("#copyResultText").textContent=copied?"Message copied. The configured WhatsApp number needs checking or the browser blocked the new tab.":"Please copy your message manually before closing this window.";
  }else{
    $("#copyResultText").textContent=copied?"The enquiry message has been copied. In the live shop, this action will send it to Rudis Gadget World on WhatsApp once their official number is connected.":"The message is ready below, but automatic copying was blocked by this browser.";
  }
  $("#enquiryForm").hidden=true;$("#copyResult").hidden=false;
});
$("#copyAgain").addEventListener("click",async()=>{const copied=await copyText(state.lastMessage);showToast(copied?"Enquiry message copied":"Copy was blocked by the browser");});
$("#mobileMenuButton").addEventListener("click",()=>{const nav=$("#mobileNav");const open=nav.classList.toggle("open");$("#mobileMenuButton").setAttribute("aria-expanded",String(open));});
$$("#mobileNav a").forEach(link=>link.addEventListener("click",()=>{$("#mobileNav").classList.remove("open");$("#mobileMenuButton").setAttribute("aria-expanded","false");}));
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeLayers();if(event.key==="/"&&!event.target.matches("input,textarea")){event.preventDefault();$("#productSearch").focus();}});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderBag();
