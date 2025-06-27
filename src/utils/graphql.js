// GraphQL client utility
const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql';

class GraphQLClient {
  constructor(endpoint = GRAPHQL_ENDPOINT) {
    this.endpoint = endpoint;
  }

  async request(query, variables = {}, headers = {}) {
    const token = localStorage.getItem('shop_admin_token');
    
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return data.data;
  }
}

export const graphqlClient = new GraphQLClient();

// Queries
export const ME_QUERY = `
  query Me {
    me {
      id
      email
      name
      phone
      stores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      managingStores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      deliveringStores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      subscriptionActive
      subscriptionType
      subscriptionStartDate
      subscriptionEndDate
      paymentCardNumber
      paymentCardHolder
      paymentCardExpiryMonth
      paymentCardExpiryYear
      paymentCardCvv
    }
  }
`;

// Auth mutations
export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      client {
        id
        email
        name
        phone
        emailVerified
        phoneVerified
        role
        stores {
          id
          name
          description
          contactEmail
          contactPhone
          contactAddress
          contactCity
          createdAt
        }
        managingStores {
          id
          name
          description
          contactEmail
          contactPhone
          contactAddress
          contactCity
          createdAt
        }
        deliveringStores {
          id
          name
          description
          contactEmail
          contactPhone
          contactAddress
          contactCity
          createdAt
        }
        subscriptionActive
        subscriptionType
        subscriptionStartDate
        subscriptionEndDate
        paymentCardNumber
        paymentCardHolder
        paymentCardExpiryMonth
        paymentCardExpiryYear
        paymentCardCvv
        createdAt
        updatedAt
      }
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation Register($email: String!, $password: String!, $name: String) {
    register(email: $email, password: $password, name: $name) {
      token
      client {
        id
        email
        name
        phone
        emailVerified
        phoneVerified
        role
        stores {
          id
          name
          description
          contactEmail
          contactPhone
          contactAddress
          contactCity
          createdAt
        }
        managingStores {
          id
          name
          description
          contactEmail
          contactPhone
          contactAddress
          contactCity
          createdAt
        }
        deliveringStores {
          id
          name
          description
          contactEmail
          contactPhone
          contactAddress
          contactCity
          createdAt
        }
        subscriptionActive
        subscriptionType
        subscriptionStartDate
        subscriptionEndDate
        paymentCardNumber
        paymentCardHolder
        paymentCardExpiryMonth
        paymentCardExpiryYear
        paymentCardCvv
        createdAt
        updatedAt
      }
    }
  }
`;

// Store mutations
export const CREATE_STORE_MUTATION = `
  mutation CreateStore($input: CreateStoreInput!) {
    createStore(input: $input) {
      id
      name
      description
      contactEmail
      contactPhone
      contactAddress
      contactCity
      createdAt
    }
  }
`;

export const UPDATE_SUBSCRIPTION_MUTATION = `
  mutation UpdateSubscription($input: UpdateSubscriptionInput!) {
    updateSubscription(input: $input) {
      id
      email
      name
      phone
      stores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      managingStores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      deliveringStores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      subscriptionActive
      subscriptionType
      subscriptionStartDate
      subscriptionEndDate
      paymentCardNumber
      paymentCardHolder
      paymentCardExpiryMonth
      paymentCardExpiryYear
      paymentCardCvv
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PAYMENT_CARD_MUTATION = `
  mutation UpdatePaymentCard($input: UpdatePaymentCardInput!) {
    updatePaymentCard(input: $input) {
      id
      email
      name
      phone
      stores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      managingStores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      deliveringStores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      subscriptionActive
      subscriptionType
      subscriptionStartDate
      subscriptionEndDate
      paymentCardNumber
      paymentCardHolder
      paymentCardExpiryMonth
      paymentCardExpiryYear
      paymentCardCvv
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_PAYMENT_CARD_MUTATION = `
  mutation RemovePaymentCard {
    removePaymentCard {
      id
      email
      name
      phone
      stores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      managingStores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      deliveringStores {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        createdAt
      }
      subscriptionActive
      subscriptionType
      subscriptionStartDate
      subscriptionEndDate
      paymentCardNumber
      paymentCardHolder
      paymentCardExpiryMonth
      paymentCardExpiryYear
      paymentCardCvv
      createdAt
      updatedAt
    }
  }
`;

// Auth service functions
export const authService = {
  async login(email, password) {
    try {
      const data = await graphqlClient.request(LOGIN_MUTATION, { email, password });
      return data.login;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  async register(email, password, name) {
    try {
      const data = await graphqlClient.request(REGISTER_MUTATION, { email, password, name });
      return data.register;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  async getCurrentUser() {
    try {
      const data = await graphqlClient.request(ME_QUERY);
      return data.me;
    } catch (error) {
      throw new Error(error.message || 'Failed to get user info');
    }
  },
};

// Store service functions
export const storeService = {
  async createStore(storeData) {
    try {
      const data = await graphqlClient.request(CREATE_STORE_MUTATION, { input: storeData });
      return data.createStore;
    } catch (error) {
      throw new Error(error.message || 'Failed to create store');
    }
  },

  async updateSubscription(subscriptionType) {
    try {
      const data = await graphqlClient.request(UPDATE_SUBSCRIPTION_MUTATION, { 
        input: { subscriptionType } 
      });
      return data.updateSubscription;
    } catch (error) {
      throw new Error(error.message || 'Failed to update subscription');
    }
  },

  async updatePaymentCard(cardData) {
    try {
      const data = await graphqlClient.request(UPDATE_PAYMENT_CARD_MUTATION, { 
        input: cardData 
      });
      return data.updatePaymentCard;
    } catch (error) {
      throw new Error(error.message || 'Failed to update payment card');
    }
  },

  async removePaymentCard() {
    try {
      const data = await graphqlClient.request(REMOVE_PAYMENT_CARD_MUTATION);
      return data.removePaymentCard;
    } catch (error) {
      throw new Error(error.message || 'Failed to remove payment card');
    }
  },
}; 