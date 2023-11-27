const { paymentError } = require("../constants/errorMessages");
const { BAD_REQUEST } = require("../constants/status-codes");
const { CustomError } = require("../utils/error");
const request = require("request")

const createPaymentLink = async (user, appointment, locale, res) => {
  const API_KEY = process.env.Paymob_API_KEY;
  const INTEGRATION_ID = process.env.Paymob_IntegrationId;
  let authToken = "";
  let orderId = "";
  const ifameOne =
    "https://accept.paymob.com/api/acceptance/iframes/315805?payment_token="; // put your iframe id here dont use mine

  return request.post(
    "https://accept.paymob.com/api/auth/tokens",
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: API_KEY }),
    },
    function (error, response) {
      if (error) {
        throw new CustomError(paymentError[locale], BAD_REQUEST)
      }
      authToken = JSON.parse(response.body).token;
      // secound request to make order
      request.post(
        "https://accept.paymob.com/api/ecommerce/orders",
        {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth_token: authToken,
            delivery_needed: "false",
            amount_cents: appointment.fees * 100,
            currency: "EGP",
            "merchant_order_id": 5,
            // items list from body
            items: [
              {
                name: "Legal advice",
                amount_cents: appointment.fees * 100,
                description: appointment.description,
                quantity: "1"
              }
            ],
            shipping_data: {
              email: "taqninUser@exa.com",
              first_name: user.first_name,
              phone_number: user.phone,
              extra_description: user.city.name.en,
              city: user.city.name.en,
              country: "Egypt",
              state: "Egypt",
              last_name: user.last_name,

            },
            shipping_details: {
              notes: "Appointment",
              number_of_packages: 1,
              weight: 1,
              weight_unit: "Kilogram",
              length: 1,
              width: 1,
              height: 1,
              contents: "Appointment concult",
            },
          }),
        },
        (error, response) => {
          if (error) {

            throw new CustomError(paymentError[locale], BAD_REQUEST)
          }

          orderId = JSON.parse(response.body).id;

          // third request to get form link then direct to the browser
          request.post(
            "https://accept.paymob.com/api/acceptance/payment_keys",
            {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                auth_token: authToken,
                amount_cents: appointment.fees * 100,
                expiration: 3600,
                order_id: orderId,
                billing_data: {
                  floor: "1",
                  street: "street",
                  last_name: user.last_name,
                  apartment: "803",
                  email: "taqninUser@exa.com",
                  building: "5",
                  first_name: user.first_name,
                  phone_number: user.phone,
                  shipping_method: "PKG",
                  city: user.city.name.en,
                  country: "Egypt",
                  state: "Egypt",
                  extra_description: appointment.id
                },
                currency: "EGP",
                integration_id: INTEGRATION_ID,
                lock_order_when_paid: "false",
              }),
            },
            (error, response) => {
              if (error) {
                throw new CustomError(paymentError[locale], BAD_REQUEST)
              }
              if (response.body !== null && response.body.token !== null) {
                return res.send({ link: `${ifameOne}${JSON.parse(response.body).token}` });
              }
              throw new CustomError(paymentError[locale], BAD_REQUEST)
            }
          );
        }
      );
    }
  );

}

module.exports = {
  createPaymentLink
}