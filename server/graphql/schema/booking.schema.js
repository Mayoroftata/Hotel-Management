import { gql } from "apollo-server-express";

const bookingTypeDefs = gql`
  type Booking {
    id: ID!
    guestFirstName: String!
    guestLastName: String!
    guestEmail: String!
    phone: String!
    room: Room
    checkIn: String!
    checkOut: String!
    status: String!
    totalPrice: Float
    cancellationReason: String
    cancelledAt: String
    createdAt: String
  }

  input BookingInput {
    guestFirstName: String!
    guestLastName: String!
    guestEmail: String!
    phone: String!
    room: ID!
    checkIn: String!
    checkOut: String!
    status: String
    totalPrice: Float
    cancellationReason: String
  }

  input BookingUpdateInput {
    guestFirstName: String
    guestLastName: String
    guestEmail: String
    phone: String
    room: ID
    checkIn: String
    checkOut: String
    status: String
    totalPrice: Float
  }

  type Query {
    getAllBookings: [Booking]
    getBookingById(id: ID!): Booking
  }

  type Mutation {
    createBooking(input: BookingInput!): Booking
    updateBooking(id: ID!, input: BookingUpdateInput!): Booking
    deleteBooking(id: ID!): String
    cancelBooking(id: ID!, reason: String!): Booking
    createPaymentIntent(amount: Int!): PaymentIntent
  }

  type PaymentIntent {
    clientSecret: String!
  }
`;

export default bookingTypeDefs;
