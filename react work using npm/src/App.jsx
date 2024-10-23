import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, ChakraProvider, Input, Text, Textarea, Select } from '@chakra-ui/react'


const products = [
  {
      id: 1,
      name: 'water bottle',
      description: 'color: blue, size: large',
      price: 100,
      discounted_price: 99,
  },
  {
      id: 2,
      name: 'mouse',
      description: 'wired usb port',
      price: 250,
      discounted_price: 199,
  },
  {
      id: 3,
      name: 'watch',
      description: 'color: black, brand: apple',
      price: 5000,
      discounted_price: 4999,
  },
  {
      id: 4,
      name: 'infinix',
      description: 'color blue, storage: 120gb, ram: 2gb',
      price: 25000,
      discounted_price: 24999,
  },
  {
      id: 5,
      name: 'shoes',
      description: 'size: 8, color blue, type: sports wear',
      price: 3000,
      discounted_price: 3000,
  },
];

const PriceBox = ({price, discounted_price}) => {
  if (price > discounted_price){
      return(
          <Box color='green'>
              <Box as='span' textDecoration='line-through' color='red'>{price}</Box>
              <span> {discounted_price}</span>
          </Box>
      )
  }
  return(
      <Box color='green'>{price}</Box>
  )
}

const ProductBox = ({name, product, checkoutForm, updateCart, ...rest}) => {
  

  function addToCart(productId) {
      
      var currentProduct = products.find((x) => { return x.id == productId });
      var currentQty = document.getElementById('qty' + productId).value == '' || document.getElementById('qty' + productId).value == null ? 1 : document.getElementById('qty' + productId).value;
      var cartExistIndex = checkoutForm.cart_details.findIndex((x) => { return x.id == productId });

      var isDecimal = currentQty != Math.trunc(currentQty);

      if (currentQty < 1 || isDecimal) {
          alert('please enter valid quantity');
          document.getElementById(`qty` + productId).value = '';
          return false
      }

      if (cartExistIndex != -1) {
          checkoutForm.cart_details[cartExistIndex].quantity = parseInt(checkoutForm.cart_details[cartExistIndex].quantity) + parseInt(currentQty);
      } else {
          // debugger;
          var cartItem = {
              ...currentProduct,
              quantity: parseInt(currentQty),
              totalAmount: function(){
                  var actualPrice = this.price > this.discounted_price ? this.discounted_price : this.price;
                  return actualPrice * this.quantity
              }
          }
          checkoutForm.cart_details.push(cartItem);
      }
      updateCart(checkoutForm.cart_details)
      document.getElementById(`qty` + productId).value = '';
  }
  
  return(
      <Box p='5' borderRadius={5} bg='gray.200' boxShadow={'xl'}>
          <h1>{ name }</h1>
          <p>{product.description}</p>
          <PriceBox price={product.price} discounted_price={product.discounted_price} />
          <Box verticalAlign='center' className='addToCartBox'>
              <Input h='7' w='100px' bg='gray.50' type='number' id={"qty" + product.id}/>
              <Button h='7' mb='1' colorScheme='gray' onClick={() => {addToCart(product.id)}}>Add to Cart</Button>
          </Box>
      </Box>
  )
}

const ProductList = ({checkoutForm, updateCart}) => {
  
  return(
      <>
      {
          products.map((x, index) => {
              return(
                  <ProductBox name={x.name} product={x} key={index} checkoutForm={checkoutForm} updateCart={updateCart} />                       
              )
          })
      }
      </>
  )
}

const TotalAmountBox = ({cart}) => {
      
      var totalPrice = cart.reduce((accumulator, currentValue) => {
          var currentPrice = currentValue.discounted_price < currentValue.price ? currentValue.discounted_price : currentValue.price
          return accumulator + currentPrice * currentValue.quantity
      }, 0);

      if (totalPrice == 0) {return(<></>)}
      
      return(
          <Box mt='2' p='1' pl='3' h='8' bg='white' borderRadius='5' className="bg-white rounded">
              Total: {totalPrice} 
          </Box>
      )

}

const CountAdd = () => {
  const [count, setCount] = React.useState(0);

  return(
      <div>
          You clicked {count} times <br/>
          <Button colorScheme='blackAlpha' h={6} onClick={()=>{setCount(count + 1)}}>Click</Button>
      </div>
  )
}

const CartBox = ({x, cart, updateCart}) => {
      
  function editQty(productId, qty) {      

      const productIndex = cart.findIndex(x => x.id === productId);
      cart[productIndex].quantity = parseInt(cart[productIndex].quantity) + qty;

      if (cart[productIndex].quantity === 0) {
          cart.splice(productIndex, 1);
      }
      updateCart(cart)
  }

  function removeItemCart(id) {
  
      var proIndex = cart.findIndex((x) => { return x.id == id });
      cart.splice(proIndex, 1);
      updateCart(cart)

  }
  
  return(
      <Box  display='flex' pl='2.5' pr='2.5' alignItems='center' justifyContent='space-between' bg={'gray.50'} borderRadius={5} h={10}>         
        <p>{ x.name }</p>
        <PriceBox price={x.price} discounted_price={x.discounted_price} />
        <Box pb='2' alignItems='center' className="flex items-center">
          <button className="h-8 mb-1.5 w-8 flex items-center justify-center" onClick={() => {editQty(x.id, 1)}}>
            <Text fontSize='28px' fontWeight='bold'>+</Text>
          </button>
          <Text display='inline' fontSize='20px' className="inline mx-2 text-xl leading-none">{x.quantity}</Text>
          <button className="h-8 mb-1.5 w-8 flex items-center justify-center" onClick={() => {editQty(x.id, -1)}}>
            <Text fontSize='32px' fontWeight='bold' className="text-3xl leading-none">-</Text>
          </button>
        </Box>
        <div>
          {x.totalAmount()}
        </div>
        <div>
          <button className="h-8 mb-1.5 w-8 flex items-center justify-center" onClick={() => {removeItemCart(x.id)}}>
            <Text color='red' fontSize='22px' fontWeight='bold' className="text-xl leading-none text-red">X</Text>
          </button>
        </div>    
      </Box>
  )
}

const CartList= ({cart, updateCart}) => {
  
  return(
      <Box id="boxList" display={'flex'} flexDirection={'column'} gap={1} mt={1}>
          {
              cart.map((cartDetail) => {
                  
                  return(
                      <CartBox x={cartDetail} cart={cart} updateCart={updateCart} />
                  )
              })
          }
      </Box>
  )
}

const App = () => {       
  
  const [message, setMessage] = React.useState('Hello React!');
  const initialCheckoutForm = {
    first_name: '',
    last_name: '',
    phone_number: 0,
    address: '',
    email: '',
    postal_code: '',
    city: '',
    country: '',
    payment_method: '',
    total_amount: '',
    cart_details: [],
  };
  const [checkoutForm, setCheckoutForm] = React.useState(initialCheckoutForm);
  const [cart, setCart] = React.useState([]);

  React.useEffect(() => {
    setCart(checkoutForm.cart_details)
  }, [checkoutForm.cart_details])

  const updateCart = (cart) => {
    setCheckoutForm((prev) => {
      const newObject = {...prev}
      newObject.cart_details = cart;

      return newObject;
    })
  }
  
  function validateFields() {
    var fields = [
      'first_name',
      'last_name',
      'address',
      'postal_code',
      'email',
      'number'
    ]
    
    var checkVaildation = true;
    fields.forEach((x) => {
      var currentField = document.getElementById(x)
      if (!currentField.checkValidity()) {
        checkVaildation = false;
      }
      document.getElementById('taskErrorField-' + x).innerHTML = currentField.validationMessage
    })   
          
    if (!checkVaildation) {
      return false
    }
    
    if (checkoutForm.cart_details.length == 0) {
      alert("Please add items in your cart first");
      return false
    }
    return true
  }

  function sumbitCheckout (){  
    const checkForm = validateFields();
    if (checkForm) {        
      //alert('Thank you for shopping with us. \nTotal Amount: '+ totalPrice);
      setCheckoutForm(initialCheckoutForm)
      document.getElementById('ecommerceForm').reset();
    }
  }

  return(

    <>
    <ChakraProvider>
      <Box id='header' fontSize='30px' bg='gray.200' display='flex' alignItems='center' h='20' color='black' pl='5' gap={2}  fontWeight={'bold'}>
        <h1> { message } </h1> <br/>
        <Button colorScheme='blackAlpha' onClick={() => {setMessage('changed')}}>Change Message</Button>
      </Box>
      <Box id='container' bg={'gray.100'} display='flex' h='98%' fontWeight={'extrabold'}>
        <Box id="sidebar" bg={'gray.300'} textColor={'gray.800'} w={60} p={5}>
          <CountAdd/>
        </Box>
        <Box id='mainBox' display={'flex'} w='100%' gap={2.5} p={4}>
          <Box w={'35%'} bg={'gray.300'} p='5'>
            <form id="ecommerceForm"  style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
              <Text fontSize={'24px'} fontWeight={'extrabold'}>Checkout Form</Text>
              <Input h='7' borderRadius='5' bg='gray.50' pl='2'type='text' name='first_name' required id='first_name' placeholder="Enter you first name" />
              <Text color='red'  id='taskErrorField-first_name'></Text>
              <Input h='7' borderRadius='5' bg='gray.50' pl='2' type='text' name='last_name' required id='last_name' placeholder="Enter you last name" />
              <Text color='red'  id='taskErrorField-last_name'></Text>
              <Input h='7' borderRadius='5' bg='gray.50' pl='2' type='text' name='number' required pattern="(\+923|923|03|3)\d{9}"  id='number' placeholder="Enter you phone number" />
              <Text color='red'  id='taskErrorField-number'></Text>
              <Textarea height="28px" minHeight='28px' pt='0' pb='0' borderRadius='5' bg='gray.50' required pl='2' id="address" name="address" placeholder="Enter your full address"></Textarea>
              <Text color='red'  id='taskErrorField-address'></Text>
              <Input h='7' borderRadius='5' bg='gray.50' pl='2' type='text' name='email' required id='email' pattern="[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}"  placeholder="Enter you email" />
              <Text color='red'  id='taskErrorField-email'></Text>
              <Input h='7' borderRadius='5' bg='gray.50' pl='2' type='text' name='postal_code' required id='postal_code' placeholder="Enter you postal code" />
              <Text color='red'  id='taskErrorField-postal_code'></Text>
              <Select h='7' borderRadius='5' bg='gray.50' id="city" name="city" defaultValue="Karachi">
                <option>Karachi</option>
                <option>Lahore</option>
                <option>Islamabed</option>
                <option>Peshawar</option>
                <option>Queta</option>
              </Select>
              <Text color='red' hidden id='taskErrorField-city'>This field is required</Text>
              <Select h='7' borderRadius='5' bg='gray.50' className="h-7 rounded bg-lightgrey-100 pl-2" id="country" name="country" defaultValue="Pakistan">
                <option>Pakistan</option>
              </Select>
              <Text color='red' hidden id='taskErrorField-country'>This field is required</Text>
              <div>
                <Text display={'flex'} alignItems={'center'} m='0'>
                  <input type='radio' name='task' required id='payment_method' defaultChecked={true} placeholder="Enter you payment_method" />
                  Cash on Delivery
                </Text>
                <Text display={'flex'} alignItems={'center'} m={0}>
                  <input type='radio' name='task' required id='payment_method' placeholder="Enter you payment_method" />
                  Online Payment
                </Text>
              </div>
              <Button type='button' colorScheme='blue' p='2.5' borderRadius={5} onClick={() => {sumbitCheckout()}} id='submitBtn'>Checkout</Button>
            </form>
            <div>
              <CartList cart={cart} updateCart={updateCart} />
              <TotalAmountBox cart={cart} />
            </div>
          </Box>

          <Box id='main'  flex='1'  display='grid' p='5' gap={'5'} gridTemplateColumns='repeat(2, 1fr)'>
            <ProductList checkoutForm={checkoutForm} updateCart={() => {updateCart(cart)}} />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
    </>
  )
}


export default App
