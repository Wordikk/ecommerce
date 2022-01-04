import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import useStyles from './styles';
import CartItem from './CartItem/CartItem';

const Cart = ({ cart, handleUpdateCartQty, handleRemoveFromCart, handleEmptyCart }) => {
    const classes = useStyles();

    const EmptyCart = () => (
        <Typography variant="subtitle1">Nie masz żadnych przedmiotów w swoim koszyku.<br/>
            <Link to="/" className={classes.link}><b>Dodaj przedmioty do koszyka.</b></Link>
        </Typography>
    );
    
    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem item={item} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart}/>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                    Do zapłaty: { cart.subtotal.formatted_with_code }
                </Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Wyczyść Koszyk</Button>
                    <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">Do Kasy</Button>
                </div>
            </div>
        </>
    );
    if(!cart.line_items) return 'Ładowanie...'
    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" gutterBottom>Twój Koszyk</Typography>
            { !cart.line_items.length ? <EmptyCart /> : <FilledCart />}
        </Container>
    )
}

export default Cart
