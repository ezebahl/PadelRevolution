/* let edad = parseFloat(prompt('Ingrese su edad'));
let mundiales = Math.floor(edad/4)

if(mundiales >= 21){console.log('viviste 21 mundiales');
}
else if(mundiales == 1){console.log('viviste 1 mundial');
}
else if(mundiales == 0){console.log('no viviste mundiales')
;}
else{
    console.log(`viviste ${mundiales} mundiales`)
;} */


//Ejemplo de ingreso de usuario a la plataforma

/* for(let i=0;i<3;i++){
    let pass = parseFloat(prompt('ingrese contraseña'));
    if (pass == 12345) {
        console.log('Contraseña correcta');
        break;
    }
    else if (i<2) {
        console.log( i + ' Vuelva a intentarlo');
    }
    else {
        console.log(i + ' Usuario bloqueado');
    }
    
    
} */

// Do While //
/* 
let numero = 0

do{
    numero = prompt('ingrese un numero');
    console.log(numero);
}while(parseInt(numero)); */

//Switch//

/* let tiempo = prompt('como esta el clima?');

switch(tiempo){
    case 'lluvioso':
        alert('llevar paraguas');
        break;
    case 'soleado':
        alert('ponerse protector');
        break;
    case 'ventoso':
        alert('ir en auto');
        break;
    case 'nevando':
        alert('abrigarse');
        break;
    default:
        alert('no puedo ayudarte');
        break;
} */

// Funciones //

/* function sumar(){
    let numero1 = 5;
    let resultado = numero1 + 5;
    return(resultado);

}

console.log(sumar())
 */

let carrito = []
function addItem(product,quantity,precio){
    carrito.push({name: product, qty: quantity, price: precio});
}

function totalCart(carrito){
    let total = 0
    for (let i=0; i<carrito.length;i++) {
        total += carrito[i].price * carrito[i].qty 
    }
    return total
}

function cart(){
    
    while(carrito.length<3) {
        const product = prompt('Ingrese hasta 3  productos o ponga listo para finalizar');
        if (product.toLowerCase()==='listo'){
            break;
        }
        
        const quantity = parseInt(prompt('Ingrese cantidad de unidades'));
        const precio = parseInt(prompt('Ingrese precio por unidad'));

        if((!isNaN(quantity)) && (!isNaN(precio))){
            addItem(product,quantity,precio);
            console.log(`"${product}" agregado al carrito.`);
        }
        else{
            console.log('El precio o cantidad no son numeros. Por favor, vuelva a ingresarlo');
        }
    }

    if(carrito.length > 0) {
        console.log('Productos en el carrito: ');
        for(let i = 0; i < carrito.length; i++){
            console.log(`${carrito[i].qty} * ${carrito[i].name}: $${carrito[i].price}`);
        }
        console.log(`Total: $${totalCart(carrito)}`);
    }
    else {
        console.log('El carrito está vacío');
    }
}

cart();