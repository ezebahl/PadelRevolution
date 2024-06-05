
let carrito = {}

const fetchData = async () => {
    try {
        const res = await fetch('../items.json');
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        pintarCards(data);
    } catch (error) {
        console.log('Error fetching data:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }

    const carritoLogo = document.getElementById('carritoLogo');
    carritoLogo.innerHTML = '<i class="fa fa-shopping-cart" style="font-size: 1.5em;color: white;"></i>';
    carritoLogo.addEventListener('click', () => {
        mostrarModal();
    });


});

const mostrarModal = () => {
    const modal = document.getElementById('carritoModal');
    const span = document.getElementsByClassName('close')[0];

    modal.style.display = 'block';

    span.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
};

const pintarCards = data => {
    const cards = document.getElementById('cards');
    const templateCard = document.getElementById('template-card').content;
    const fragment = document.createDocumentFragment();

    data.forEach(producto => {
        const clone = templateCard.cloneNode(true);
        clone.querySelector('h6').textContent = producto.title;
        clone.querySelector('p').textContent = producto.price; 
        clone.querySelector('img').src = producto.image; 
        clone.querySelector('img').alt = producto.title;
        clone.querySelector('.btn-primary').dataset.id = producto.id
        fragment.appendChild(clone);
    })
    cards.appendChild(fragment);

};


cards.addEventListener('click', e =>{
    addCarrito(e);
});

const addCarrito = e => {
    //console.log(e.target);
    //console.log(e.target.classList.contains('btn-primary'));
    if(e.target.classList.contains('btn-primary')) {
        setCarrito(e.target.parentElement);
    };
    e.stopPropagation();
};  

const setCarrito = objeto => {
    const producto = {
        id : objeto.querySelector('.btn-primary').dataset.id,
        title : objeto.querySelector('h6').textContent,
        price : objeto.querySelector('p').textContent,
        cantidad : 1,
    }
    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    };

    carrito[producto.id] = {...producto};
    pintarCarrito();
};

const pintarCarrito = () => {
    const itemsCarrito = document.getElementById('items-carrito');
    itemsCarrito.innerHTML = '';
    const fragment = document.createDocumentFragment();

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('carrito-header');

    const titleHeader = document.createElement('div');
    titleHeader.classList.add('carrito-title');
    titleHeader.textContent = 'Producto';

    const cantidadHeader = document.createElement('div');
    cantidadHeader.classList.add('carrito-cantidad');
    cantidadHeader.textContent = 'Cantidad';

    const priceHeader = document.createElement('div');
    priceHeader.classList.add('carrito-price');
    priceHeader.textContent = 'Precio';

    const removeHeader = document.createElement('div');
    removeHeader.classList.add('carrito-remove');

    headerDiv.appendChild(titleHeader);
    headerDiv.appendChild(cantidadHeader);
    headerDiv.appendChild(priceHeader);
    headerDiv.appendChild(removeHeader);
    fragment.appendChild(headerDiv);

    let total = 0;

    Object.values(carrito).forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('carrito-item');
        
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('carrito-title');
        titleDiv.textContent = producto.title;

        const cantidadDiv = document.createElement('div');
        cantidadDiv.classList.add('carrito-cantidad');
        cantidadDiv.textContent = producto.cantidad;

        const priceDiv = document.createElement('div');
        priceDiv.classList.add('carrito-price');
        priceDiv.textContent = `$${producto.price}`;

        const removeDiv = document.createElement('div');
        removeDiv.classList.add('carrito-remove');
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('btn');
        removeBtn.innerHTML = '<i class="far fa-trash-alt" style="font-size: 1.2em;"></i>';        
        removeBtn.dataset.id = producto.id;
        removeBtn.addEventListener('click', () => {
            eliminarProducto(producto.id);
        });
        removeDiv.appendChild(removeBtn);

        div.appendChild(titleDiv);
        div.appendChild(cantidadDiv);
        div.appendChild(priceDiv);
        div.appendChild(removeDiv);
        fragment.appendChild(div);

        total += producto.cantidad * parseFloat(producto.price);

    });

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('carrito-total');

    const totalTitleDiv = document.createElement('div');
    totalTitleDiv.classList.add('total-title');
    totalTitleDiv.textContent = 'Total';

    const totalAmountDiv = document.createElement('div');
    totalAmountDiv.classList.add('total-amount');
    totalAmountDiv.textContent = `$${total.toFixed(2)}`;

    totalDiv.appendChild(totalTitleDiv);
    totalDiv.appendChild(totalAmountDiv);
    fragment.appendChild(totalDiv);

    itemsCarrito.appendChild(fragment);
    mostrarModal();

    localStorage.setItem('carrito',JSON.stringify(carrito));

};

const eliminarProducto = id => {
    delete carrito[id];
    pintarCarrito();
};