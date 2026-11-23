# Afrixa × Rudis Gadget World — storefront concept

A mobile-first, plain HTML/CSS/JavaScript storefront concept. No Node.js, npm, framework, database or build step is required.

## What is in this demo

- Responsive landing page and catalogue
- Search and category filters
- Enquiry shortlist with quantities
- Enquiry form that creates a structured WhatsApp-ready message
- Copy-to-clipboard fallback for preview mode
- Clear demo labels so placeholder products are not mistaken for real stock

## Important: demo data only

This preview is not connected to Rudis Gadget World's inventory, prices, WhatsApp account, payment provider or delivery operations. The products and images are illustrative. Do not present them as confirmed stock.

Before public launch:

1. Replace the six sample entries in `script.js` with the owner's actual products, photographs, model details and prices (or price-on-request).
2. Confirm the official WhatsApp business number and set `STORE_CONFIG.whatsappNumber` in `script.js` to international digits only, for example `2547XXXXXXXX`.
3. Confirm the business name, contact details, operating location, delivery coverage/fees, payment methods, warranty and returns policy with the owner.
4. Replace the illustrative photographs and placeholder RGW monogram with original assets supplied or approved by the owner.
5. Remove the `noindex,nofollow` meta tag in `index.html` when the owner approves a public launch.
6. Test every enquiry flow on a real Android phone before sharing publicly.

## Preview in Termux

After extracting the folder, enter it and run:

```bash
cd afrixa-rudis-demo
python -m http.server 8080
```

Then open this address in Chrome on the same phone:

```text
http://127.0.0.1:8080
```

Stop the local server with `CTRL+C` in Termux.

## GitHub

Create an empty GitHub repository, then from this folder:

```bash
git init
git add .
git commit -m "Build Afrixa Rudis Gadget World demo storefront"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

To publish a static preview, enable GitHub Pages for the `main` branch and `/ (root)` in the repository's Pages settings.

## Technical limits

This is a front-end sales demonstration, not a live e-commerce backend. It does not process payments, reserve stock, calculate delivery, save customer orders to a database or provide an owner dashboard. Those should be added only after the owner confirms the workflow and information required.
