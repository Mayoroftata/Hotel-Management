import { gql } from "graphql-tag";

const serviceTypeDefs = gql`
  type Service {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
    type: String
    capacity: Int
    cuisine: String
    priceRange: String
    openingHours: String
    duration: String
    maxCapacity: Int
    images: [String]
    isAvailable: Boolean!
  }

  type MeetingEvent {
    id: ID!
    title: String!
    description: String
    type: String
    capacity: Int
    price: Float
    images: [String]
    isAvailable: Boolean
  }

  type Dining {
    id: ID!
    name: String!
    description: String
    cuisine: String
    priceRange: String
    openingHours: String
    isAvailable: Boolean
  }

  type RecreationActivity {
    id: ID!
    name: String!
    description: String
    category: String
    price: Float
    duration: String
    maxCapacity: Int
    images: [String]
    isAvailable: Boolean
  }

  type ServiceBooking {
    id: ID!
    customerName: String!
    customerEmail: String
    phone: String
    service: Service
    serviceType: String!
    bookingDate: String!
    numberOfPeople: Int
    status: String
    totalPrice: Float
    notes: String
    createdAt: String
  }

  type Query {
    getAllServices: [Service]
    getServiceById(id: ID!): Service
    getServicesByCategory(category: String!): [Service]
    getAllMeetingsEvents: [MeetingEvent]
    getAllDining: [Dining]
    getAllRecreationActivities: [RecreationActivity]
    getAllServiceBookings: [ServiceBooking]
    getServiceBookingById(id: ID!): ServiceBooking
  }

  input ServiceInput {
    name: String!
    description: String!
    price: Float!
    category: String!
    type: String
    capacity: Int
    cuisine: String
    priceRange: String
    openingHours: String
    duration: String
    maxCapacity: Int
    images: [String]
    isAvailable: Boolean
  }

  input MeetingEventInput {
    title: String!
    description: String
    type: String!
    capacity: Int
    price: Float!
    images: [String]
    isAvailable: Boolean
  }

  input DiningInput {
    name: String!
    description: String
    cuisine: String
    priceRange: String
    openingHours: String
    isAvailable: Boolean
  }

  input RecreationActivityInput {
    name: String!
    description: String
    category: String!
    price: Float!
    duration: String
    maxCapacity: Int
    images: [String]
    isAvailable: Boolean
  }

  input ServiceBookingInput {
    customerName: String!
    customerEmail: String
    phone: String
    service: ID
    serviceType: String!
    bookingDate: String!
    numberOfPeople: Int
    status: String
    totalPrice: Float
    notes: String
  }

  input ServiceBookingUpdateInput {
    customerName: String
    customerEmail: String
    phone: String
    service: ID
    serviceType: String
    bookingDate: String
    numberOfPeople: Int
    status: String
    totalPrice: Float
    notes: String
  }

  type Mutation {
    createService(input: ServiceInput!): Service
    updateService(id: ID!, input: ServiceInput!): Service
    deleteService(id: ID!): String
    createMeetingEvent(input: MeetingEventInput!): MeetingEvent
    updateMeetingEvent(id: ID!, input: MeetingEventInput!): MeetingEvent
    deleteMeetingEvent(id: ID!): String
    createDining(input: DiningInput!): Dining
    updateDining(id: ID!, input: DiningInput!): Dining
    deleteDining(id: ID!): String
    createRecreationActivity(input: RecreationActivityInput!): RecreationActivity
    updateRecreationActivity(id: ID!, input: RecreationActivityInput!): RecreationActivity
    deleteRecreationActivity(id: ID!): String
    createServiceBooking(input: ServiceBookingInput!): ServiceBooking
    updateServiceBooking(id: ID!, input: ServiceBookingUpdateInput!): ServiceBooking
    deleteServiceBooking(id: ID!): String
  }
`;

export default serviceTypeDefs;
