/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
    const stripe = Stripe(
      'pk_test_51K2yufSE4k0wagIOKRqB4RYAaEF1HKOZmuVTjiWrXtqIX8mKpoAUq9T6VQVi4kmobZZUUgLfPLdgJ4r5urG7gNLB00f2Izod97'
    );  
    
    try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    //2) Create checkout form + change credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
