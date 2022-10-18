import Stripe from "stripe";

export const stripeInstance = new Stripe(
  `sk_test_51JUBiCIXuOafNhy8awpHrW6mHw4Fa4KIBFFSHEBdo9eWiMQDDXfb2HWjRACh1545h8ggtX0z3nnT1YFxQuhQPglK00J5a7PR8W`,
  {
    apiVersion: "2022-08-01",
  }
);
