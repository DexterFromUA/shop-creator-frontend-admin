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
      subscriptionActive
      subscriptionType
      subscriptionStartDate
      subscriptionEndDate
      stores {
          id
      }
      managingStores {
          id
      }
      deliveringStores {
          id
      }
      paymentCardNumber
      paymentCardHolder
      paymentCardExpiryMonth
      paymentCardExpiryYear
      paymentCardCvv
    }
  }
`;

export const MY_STORES_QUERY = `
  query MyStores {
    myStores {
      id
      name
      description
      contactEmail
      contactPhone
      contactAddress
      contactCity
      isActive
      appId
      owner {
        id
      }
      managers {
        id
      }
      couriers {
        id
      }
      createdAt
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
          isActive
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
          isActive
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
          isActive
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
          isActive
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
          isActive
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
          isActive
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

// App mutations
export const CREATE_APP_MUTATION = `
  mutation CreateApp($input: CreateAppInput!) {
    createApp(input: $input) {
      id
      name
      description
      slug
      version
      iconUrl
      splashScreenUrl
      primaryColor
      secondaryColor
      targetPlatforms
      defaultLanguage
      currency
      keywords
      screenshots
      storeId
      appUrl
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
        isActive
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
        isActive
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
        isActive
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

export const GET_STORE_QUERY = `
  query GetStore($storeId: ID!) {
    store(id: $storeId) {
      id
      name
      description
      contactEmail
      contactPhone
      contactAddress
      contactCity
      isActive
      appId
      owner {
        id
        email
        name
        phone
        subscriptionActive
        subscriptionType
        subscriptionStartDate
        subscriptionEndDate
      }
      managers {
        id
        email
        name
        phone
      }
      couriers {
        id
        email
        name
        phone
      }
      createdAt
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
        isActive
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
        isActive
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
        isActive
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
        isActive
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
        isActive
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
        isActive
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
  async getMyStores() {
    try {
      const data = await graphqlClient.request(MY_STORES_QUERY);
      return data.myStores;
    } catch (error) {
      throw new Error(error.message || 'Failed to get stores');
    }
  },

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

  async getStore(storeId) {
    try {
      const data = await graphqlClient.request(GET_STORE_QUERY, { storeId });
      return data.store;
    } catch (error) {
      throw new Error(error.message || 'Failed to get store');
    }
  },
};

// App service functions
export const appService = {
  async createApp(appData) {
    try {
      const data = await graphqlClient.request(CREATE_APP_MUTATION, { input: appData });
      return data.createApp;
    } catch (error) {
      throw new Error(error.message || 'Failed to create app');
    }
  },
}; 