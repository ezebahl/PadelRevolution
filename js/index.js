let carrito = {};

const fetchData = async () => {
    try {
        const res = await fetch('../items.json');
        if (!res.ok) {
            throw new Error('No se pudo obtener la información de los productos.');
        }
        const data = await res.json();
        pintarCards(data);
    } catch (error) {
        mostrarError(error.message);
    }
};

const mostrarError = mensaje => {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-danger', 'mt-3', 'mx-3'); 
    errorDiv.textContent = mensaje;

    const cardsSection = document.getElementById('cards').parentElement; 
    cardsSection.insertBefore(errorDiv, document.getElementById('cards')); 
};

document.addEventListener('DOMContentLoaded', () => {
    const carritoLogo = document.getElementById('carritoLogo');
    carritoLogo.innerHTML = '<i class="fa fa-shopping-cart" style="font-size: 1.5em;color: white;"></i><span id="carritoCantidad" class="carrito-cantidad-badge">0</span>';

    cargarCantidadCarrito();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
    fetchData();
    carritoLogo.addEventListener('click', () => {
        mostrarModal();
    });

    const continuarCompraBtn = document.getElementById('continuarCompraBtn');
    continuarCompraBtn.addEventListener('click', () => {
        document.getElementById('nombre').value = 'Ezequiel';
        document.getElementById('apellido').value = 'Bahl';
        document.getElementById('email').value = 'ebahl@coderhouse.com';
        mostrarConfirmarCompraModal();
    });

    // Cerrar el modal al hacer clic en la "X"
    const closeModalBtns = document.querySelectorAll('.close');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Cerrar el modal al hacer clic fuera del área del modal
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    };
    //Abrir datos tarjeta cuando el metodo de pago es 'tarjeta'
    const metodoPagoSelect = document.getElementById('metodoPago');
    const tarjetaInfoDiv = document.getElementById('tarjeta-info');

    metodoPagoSelect.addEventListener('change', function() {
        if (this.value === 'tarjeta') {
            tarjetaInfoDiv.style.display = 'block';
            document.getElementById('numeroTarjeta').value = '4660 9500 0839 2234';
            document.getElementById('fechaExpiracion').value = '12/26';
            document.getElementById('cvv').value = '101';
        } else {
            tarjetaInfoDiv.style.display = 'none';
        }
    });

    const mostrarConfirmarCompraModal = () => {
        const confirmarCompraModal = document.getElementById('confirmarCompraModal');
        confirmarCompraModal.style.display = 'block';
        document.getElementById('mensajeFelicitaciones').style.display = 'none';
        document.getElementById('confirmarCompraForm').style.display = 'block';
        document.getElementById('confCompra').style.display = 'block';
    };
});

const confirmarCompraForm = document.getElementById('confirmarCompraForm');
confirmarCompraForm.addEventListener('submit', (e) => {
    e.preventDefault();
    confirmarCompraForm.style.display = 'none';
    document.getElementById('mensajeFelicitaciones').style.display = 'block';
    document.getElementById('confCompra').style.display = 'none';
    

    limpiarCarritoYLocalStorage();
});

const cerrarFelicitacionesBtn = document.getElementById('cerrarFelicitaciones');
cerrarFelicitacionesBtn.addEventListener('click', () => {
    carritoModal.style.display = 'none';
    confirmarCompraModal.style.display = 'none';
});
const limpiarCarritoYLocalStorage = () => {
    carrito = {};
    localStorage.removeItem('carrito'); 
    localStorage.removeItem('carritoCantidad'); 
    pintarCarrito(); 
    actualizarContadorCarrito(); 
    document.getElementById('carritoCantidad').textContent = '0'; 
};

const actualizarContadorCarrito = () => {
    let totalItems = calcularTotalItemsEnCarrito();
    const carritoCantidad = document.getElementById('carritoCantidad');
    carritoCantidad.textContent = totalItems;

    localStorage.setItem('carritoCantidad', totalItems);
};

const cargarCantidadCarrito = () => {
    const carritoCantidad = localStorage.getItem('carritoCantidad');
    if (carritoCantidad) {
        document.getElementById('carritoCantidad').textContent = carritoCantidad;
    }
};

const mostrarModal = () => {
    const modal = document.getElementById('carritoModal');
    const span = document.getElementsByClassName('close')[0];

    modal.style.display = 'block';

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
        clone.querySelector('.btn-primary').dataset.id = producto.id;
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};

cards.addEventListener('click', e => {
    addCarrito(e);
});

const addCarrito = e => {
    const btnComprar = e.target;
    if (btnComprar.classList.contains('btn-primary') && !btnComprar.classList.contains('loading')) {
        const originalText = btnComprar.textContent; 
        btnComprar.textContent = ''; 
        btnComprar.classList.add('loading'); 

        setTimeout(() => {
            setCarrito(btnComprar.closest('.card-body'));
            mostrarModal();
            btnComprar.classList.remove('loading');
            btnComprar.textContent = originalText; 
        }, 500); 
    }
    e.stopPropagation();
};

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-primary').dataset.id,
        title: objeto.querySelector('h6').textContent,
        price: parseFloat(objeto.querySelector('p').textContent.replace('$', '')), // Convertir el precio a número
        cantidad: 1,
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = { ...producto };
    pintarCarrito();
    actualizarContadorCarrito();
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

    const carritoCantidad = document.getElementById('carritoCantidad');
    carritoCantidad.textContent = calcularTotalItemsEnCarrito();

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

        // Crear el contenedor para la cantidad y los botones
        const cantidadContainer = document.createElement('div');
        cantidadContainer.classList.add('cantidad-container');

        // Botón de -
        const minusBtn = document.createElement('button');
        minusBtn.classList.add('btn-minus');
        minusBtn.textContent = '-';
        minusBtn.dataset.id = producto.id;
        minusBtn.addEventListener('click', () => {
            modificarCantidad(producto.id, -1);
        });
        cantidadContainer.appendChild(minusBtn);

        // Campo de entrada para cantidad
        const cantidadInput = document.createElement('input');
        cantidadInput.classList.add('cantidad-input');
        cantidadInput.type = 'number';
        cantidadInput.value = producto.cantidad;
        cantidadInput.min = 1;
        cantidadInput.addEventListener('keypress', (e) => {
            const key = e.key;
            // Permitir solo dígitos y Enter
            if (!/\d/.test(key) && key !== 'Enter') {
                e.preventDefault();
            }
            if (key === 'Enter') {
                let nuevaCantidad = parseInt(e.target.value);
                if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
                    nuevaCantidad = 1; // Evita cantidades menores a 1 o inválidas
                }
                actualizarCantidad(producto.id, nuevaCantidad);
            }
        });

        cantidadInput.addEventListener('keypress', (e) => {
            const key = e.key;
            // Permitir solo dígitos
            if (!/\d/.test(key)) {
                e.preventDefault();
            }
        });

        cantidadContainer.appendChild(cantidadInput);

        // Botón de +
        const plusBtn = document.createElement('button');
        plusBtn.classList.add('btn-plus');
        plusBtn.textContent = '+';
        plusBtn.dataset.id = producto.id;
        plusBtn.addEventListener('click', () => {
            modificarCantidad(producto.id, 1);
        });
        cantidadContainer.appendChild(plusBtn);

        // Agregar el contenedor de cantidad al div principal de cantidad
        cantidadDiv.appendChild(cantidadContainer);

        const priceDiv = document.createElement('div');
        priceDiv.classList.add('carrito-price');
        priceDiv.textContent = `$${(producto.price * producto.cantidad).toFixed(2)}`; // Calcular el precio total del producto

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

        total += producto.price * producto.cantidad;

        // Actualizar resumen de compra
        document.getElementById('monto').textContent = total.toFixed(2);
        document.getElementById('total').textContent = (total + 50).toFixed(2); // Incluye el costo de envío
    
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

    localStorage.setItem('carrito', JSON.stringify(carrito));
};

const actualizarCantidad = (id, nuevaCantidad) => {
    if (carrito[id]) {
        carrito[id].cantidad = nuevaCantidad;
        pintarCarrito();
        actualizarContadorCarrito();
    }
};

const eliminarProducto = id => {
    delete carrito[id];
    pintarCarrito();
    actualizarContadorCarrito();
};

const modificarCantidad = (id, change) => {
    if (carrito[id]) {
        carrito[id].cantidad += change;
        if (carrito[id].cantidad <= 0) {
            delete carrito[id];
        }
        pintarCarrito();
        actualizarContadorCarrito();
    }
};

const calcularTotalItemsEnCarrito = () => {
    let totalItems = 0;
    Object.values(carrito).forEach(producto => {
        totalItems += producto.cantidad;
    });
    return totalItems;
};
