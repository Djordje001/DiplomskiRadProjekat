/*import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const PayPalButton = ({ discountedTotal, pomocna, tokenData, removeAllFromCart,azurirajProizvode,azurirajPorudzbine }) => {
    const paypalRef = useRef(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    const checkStock = async () => {
        const formData = new FormData();
        formData.append("stavkePorudzbineJson", pomocna());
        try {
            const response = await axios.post('/api/proizvodi/check-stock', formData);
            return response.data.indikator;
        } catch (error) {
            console.error('Error checking stock:', error);
            return false;
        }
    };


    useEffect(() => {
        return () => {
            // Očisti sve postojeće PayPal dugme pre nego što komponenta bude unmountovana
            if (window.paypal) {
                window.paypal.Buttons().close();
            }
        };
    }, []);
 //ASEUvoR9yYuFnGBf8xMdyRImMzP1nwonbcpwiuXEEYIgVPIvKYV_PWs6yJpO7xY_lAjjaKcvzg8yoyg1
 useEffect(() => {
    const scriptId = 'paypal-script';

    if (document.getElementById(scriptId)) {
        setIsScriptLoaded(true);
        return;
    }

    const script = document.createElement('script');
    const clientId = "AdeyDdFd2upGFKP3sWHoyexk0nW54P2SvjA7BZE0-ASlfNkk_t-GIDH-fan6PqvUTT11B5yDPSBgtmBH";
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=capture&components=buttons,hosted-fields`;
    script.onload = () => {
        setIsScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
        // Proveri da li script tag još uvek postoji u dokumentu pre uklanjanja
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            document.body.removeChild(existingScript);
        }
    };
}, []);

    useEffect(() => {
        if (isScriptLoaded && paypalRef.current) {
            window.paypal.Buttons({
              //  fundingSource: window.paypal.FUNDING.CARD,
              fundingSource: window.paypal.FUNDING.PAYPAL,
                createOrder: (data, actions) => {
                   return checkStock().then(isAvailable => {
                        if (isAvailable) {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                     currency_code: "EUR", // Ovde dodajte valutu
                                        value: discountedTotal.toFixed(2)
                                    }
                                }]
                            });
                       } else {
                        alert('Some items are not available in the requested quantity. Please adjust your cart and try again.');
                            return;
                        }
                  });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                      //  alert('Payment successful!');
                        console.log(details);
                        const shipping = details.purchase_units[0].shipping;
                        pomocna();
                        axios.post('/api/porudzbine/add-order-add-transaction', {
                            paymentId: details.id,
                            transactionId:details.purchase_units[0].payments.captures[0].id,
                            amount: details.purchase_units[0].amount.value,
                            currency: details.purchase_units[0].amount.currency_code,
                            transactionStatus: details.status,
                            payerId: data.payerID,
                            fullName: shipping.name.full_name,
                            email: details.payer.email_address,
                            address: `${shipping.address.address_line_1}, ${shipping.address.admin_area_2}, ${shipping.address.postal_code}, ${shipping.address.country_code}`,
                           phoneNumber: tokenData.brojTelefona,
                            stavkePorudzbineJson: pomocna()
                        }, {
                            headers: {
                                'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
                                'Content-Type': 'application/json'
                            }
                        }).then(response => {
                            alert(response.data);
                            removeAllFromCart();
                            azurirajProizvode();
                            azurirajPorudzbine();
                        }).catch(error => {
                            console.error('Failed to update backend:', error);
                            
                            //OVDE TREBA DA MI POZOVES PAYPAL I DA MI PONISTIS PRETHODNO OBAVLJENU NOVCANU TRANSAKCIJU JER NISAM USPEO DA KONTAKTIRAM SA BACKENDOM 

                        });
                    });
                },
                onError: (err) => {
                    console.error('Payment error:', err);
                 //  alert('Payment failed, please try again.');
                }
            }).render(paypalRef.current);
        }
    }, [isScriptLoaded, discountedTotal]);

    return <div ref={paypalRef} style={{ maxWidth: '500px', margin: 'auto' }}></div>;
};

export default PayPalButton;*/


import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PayPalButton = ({ discountedTotal, proizvodiUKorpi, tokenData, removeAllFromCart, azurirajProizvode, azurirajPorudzbine }) => {
    const navigate=useNavigate();
    const paypalRef = useRef(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [trebaPrikaz,setTrebaPrikaz]=useState(true);
    const checkStock = async () => {
        const formData = new FormData();
        formData.append("stavkePorudzbineJson", proizvodiUKorpi);
        try {
            const response = await axios.post('/api/proizvodi/check-stock', formData);
            console.log('Stock check response:', response.data);
            return response.data.indikator;
        } catch (error) {
            console.error('Error checking stock:', error);
            return false;
        }
    };
    function vratiSeUKorpu(){
        navigate("/cart");
    }

    useEffect(() => {
        const scriptId = 'paypal-script';

        if (document.getElementById(scriptId)) {
            setIsScriptLoaded(true);
            console.log("PayPal script already loaded.");
            return;
        }

      
      
      
        


        const script = document.createElement('script');
        script.crossOrigin = 'anonymous';
        const clientId = "AdeyDdFd2upGFKP3sWHoyexk0nW54P2SvjA7BZE0-ASlfNkk_t-GIDH-fan6PqvUTT11B5yDPSBgtmBH";
        script.id = scriptId;
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=capture&components=buttons,hosted-fields`;
        script.onload = () => {
            console.log("PayPal script loaded successfully.");
            setIsScriptLoaded(true);
        };
        script.onerror = (err) => {
            console.error("Error loading PayPal script:", err);
        };
        document.body.appendChild(script);

        return () => {
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

    useEffect(() => {
        if (isScriptLoaded && paypalRef.current && window.paypal) {
            console.log("Rendering PayPal buttons.");
            window.paypal.Buttons({
             //   fundingSource: window.paypal.FUNDING.PAYPAL,
                createOrder: (data, actions) => {
                   // setTrebaPrikaz(true);
                    // return checkStock().then(isAvailable => {
                    //     if (isAvailable) {
                           
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        currency_code: "EUR",
                                        value: discountedTotal.toFixed(2)
                                    }
                                }]
                            });
                        // } else {
                        //     setTrebaPrikaz(false);
                        //     alert('Some items are not available in the requested quantity. Please adjust your cart and try again.');
                        //    // throw new Error('Stock unavailable');
                        // }
                    
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        console.log('Payment successful, details:', details);
                        const shipping = details.purchase_units[0].shipping;
                        axios.post('/api/porudzbine/add-order-add-transaction', {
                            paymentId: details.id,
                            transactionId: details.purchase_units[0].payments.captures[0].id,
                            amount: details.purchase_units[0].amount.value,
                            currency: details.purchase_units[0].amount.currency_code,
                            transactionStatus: details.status,
                            payerId: data.payerID,
                            fullName: shipping.name.full_name,
                            email: details.payer.email_address,
                            address: `${shipping.address.address_line_1}, ${shipping.address.admin_area_2}, ${shipping.address.postal_code}, ${shipping.address.country_code}`,
                            phoneNumber: tokenData.brojTelefona,
                            stavkePorudzbineJson: proizvodiUKorpi
                        }, {
                            headers: {
                                'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
                                'Content-Type': 'application/json'
                            }
                        }).then(response => {
                            alert(response.data);
                            removeAllFromCart();
                            azurirajProizvode();
                            azurirajPorudzbine();
                            //navigate("/cart");
                            
                            setTimeout(() => {
                                vratiSeUKorpu();
                            }, 100);
                                
                            
                        }).catch(error => {
                            console.error('Failed to update backend:', error);
                            alert(error.response.data);
                            //error.response.data
                        });
                    });
                },
                onError: (err) => {
                    console.error('Payment error:', err);
                    alert("payment failed");
                //   
                }
            }).render(paypalRef.current);
        }
    }, [isScriptLoaded, discountedTotal]);

    return <div ref={paypalRef} style={{ maxWidth: '500px', margin: 'auto' }}></div>;
};

export default PayPalButton;
