import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core'

import { Link } from 'react-router-dom';
import { commerce } from '../../../lib/commerce';
import useStyles from './styles';
import AddressForm from '../AddresForm';
import PaymentForm from '../PaymentForm';

const steps = ['Adres dostawy', 'Szczegóły płatności'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const classes = useStyles();

    useEffect(() => {
        if(cart.id){
            const generateToken = async () => {
                try {
                    const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'});
                    console.log(token);
                    setCheckoutToken(token);
                } catch (error) {
                    console.log(error);
                }
            }
            generateToken();
        }
    }, [cart]);

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);


    const next = (data) => {
        setShippingData(data);

        nextStep();
    }

    let Confirmation = () => order.customer ? (
        <>        <div>
            <Typography variant="h5">Dziękujemy za zakupy!, {order.customer.firstname} {order.customer.lastname}</Typography>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">Zamówienie: {order.customer_reference}</Typography>
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">Wróć na Stronę Główną.</Button>
        </>

    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if(error){
        <>
            <Typography variant="h5">Error: {error}</Typography>
        </>
    }

    const Form = () => activeStep === 0 
    ? <AddressForm checkoutToken={checkoutToken} next={next} /> 
    : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} /> ;

        

    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar}/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Kasa</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) =>(
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    )
}

export default Checkout