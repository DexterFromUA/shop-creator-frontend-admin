// GraphQL client utility
const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql';

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

// Payout Queries
export const GET_STORE_BANK_ACCOUNT_QUERY = `
  query GetStoreBankAccount($storeId: String!) {
    getStoreBankAccount(storeId: $storeId) {
      id
      name
      bankAccountNumber
      bankAccountHolder
      bankName
      bankIban
      bankSwiftCode
    }
  }
`;

export const GET_STORE_TRANSACTIONS_QUERY = `
  query GetStoreTransactions($storeId: String!) {
    getStoreTransactions(storeId: $storeId) {
      id
      amount
      type
      status
      description
      externalId
      paymentMethod
      currency
      processingFee
      netAmount
      referenceOrderId
      metadata
      createdAt
      updatedAt
      processedAt
    }
  }
`;

// Payout Mutations
export const UPDATE_BANK_ACCOUNT_MUTATION = `
  mutation UpdateBankAccount($storeId: String!, $input: UpdateBankAccountInput!) {
    updateBankAccount(storeId: $storeId, input: $input) {
      id
      name
      bankAccountNumber
      bankAccountHolder
      bankName
      bankIban
      bankSwiftCode
    }
  }
`;

export const CREATE_TRANSACTION_MUTATION = `
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      amount
      type
      status
      description
      externalId
      paymentMethod
      currency
      processingFee
      netAmount
      referenceOrderId
      metadata
      createdAt
      updatedAt
      processedAt
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

// Product queries and mutations
export const GET_STORE_PRODUCTS_QUERY = `
  query GetStoreProducts($storeId: ID!) {
    storeProducts(storeId: $storeId) {
      id
      name
      description
      price
      category
      amount
      isPreOrder
      isDiscount
      discountPercent
      imgUrls
      orderCount
      isActive
      sizeInventory {
        id
        size
        quantity
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_QUERY = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      category
      amount
      isPreOrder
      isDiscount
      discountPercent
      imgUrls
      orderCount
      isActive
      sizeInventory {
        id
        size
        quantity
        createdAt
        updatedAt
      }
      store {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      category
      amount
      isPreOrder
      isDiscount
      discountPercent
      imgUrls
      orderCount
      isActive
      sizeInventory {
        id
        size
        quantity
        createdAt
        updatedAt
      }
      store {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

export const UPDATE_PRODUCT_STOCK_MUTATION = `
  mutation UpdateProductStock($id: ID!, $sizeInventory: [ProductSizeInput!]!) {
    updateProductStock(id: $id, sizeInventory: $sizeInventory) {
      id
      name
      amount
      sizeInventory {
        id
        size
        quantity
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
      category
      amount
      isPreOrder
      isDiscount
      discountPercent
      imgUrls
      orderCount
      isActive
      sizeInventory {
        id
        size
        quantity
        createdAt
        updatedAt
      }
      store {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// Product service functions
export const productService = {
  async getStoreProducts(storeId) {
    try {
      const data = await graphqlClient.request(GET_STORE_PRODUCTS_QUERY, { storeId });
      return data.storeProducts || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to get products');
    }
  },

  async getProduct(id) {
    try {
      const data = await graphqlClient.request(GET_PRODUCT_QUERY, { id });
      return data.product;
    } catch (error) {
      throw new Error(error.message || 'Failed to get product');
    }
  },

  async createProduct(productData) {
    try {
      const data = await graphqlClient.request(CREATE_PRODUCT_MUTATION, { input: productData });
      return data.createProduct;
    } catch (error) {
      throw new Error(error.message || 'Failed to create product');
    }
  },

  async deleteProduct(id) {
    try {
      const data = await graphqlClient.request(DELETE_PRODUCT_MUTATION, { id });
      return data.deleteProduct;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete product');
    }
  },

  async updateProductStock(id, sizeInventory) {
    try {
      const data = await graphqlClient.request(UPDATE_PRODUCT_STOCK_MUTATION, { id, sizeInventory });
      return data.updateProductStock;
    } catch (error) {
      throw new Error(error.message || 'Failed to update product stock');
    }
  },

  async updateProduct(id, productData) {
    try {
      const data = await graphqlClient.request(UPDATE_PRODUCT_MUTATION, { id, input: productData });
      return data.updateProduct;
    } catch (error) {
      throw new Error(error.message || 'Failed to update product');
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

// Invite queries and mutations
export const GET_INVITE_QUERY = `
  query GetInvite($token: String!) {
    getInvite(token: $token) {
      id
      token
      email
      role
      expiresAt
      store {
        id
        name
        owner {
          id
          name
          email
        }
      }
    }
  }
`;

export const GET_STORE_INVITES_QUERY = `
  query GetStoreInvites($storeId: String!) {
    getStoreInvites(storeId: $storeId) {
      id
      token
      email
      role
      createdAt
      expiresAt
      isUsed
      usedAt
      revoked
      revokedAt
      store {
        id
        name
      }
      usedBy {
        id
        name
        email
      }
    }
  }
`;

export const CREATE_INVITE_MUTATION = `
  mutation CreateInvite($input: CreateInviteInput!) {
    createInvite(input: $input) {
      id
      token
      role
      createdAt
      expiresAt
      store {
        id
        name
      }
      usedBy {
        id
        name
        email
      }
    }
  }
`;

export const ACCEPT_INVITE_MUTATION = `
  mutation AcceptInvite($token: String!) {
    acceptInvite(token: $token) {
      id
    }
  }
`;

export const REVOKE_INVITE_MUTATION = `
  mutation RevokeInvite($id: String!) {
    revokeInvite(id: $id) {
      id
      token
      email
      role
      isUsed
      usedAt
    }
  }
`;

export const REMOVE_TEAM_MEMBER_MUTATION = `
  mutation RemoveTeamMember($storeId: String!, $userId: String!) {
    removeTeamMember(storeId: $storeId, userId: $userId) {
      id
      name
      email
    }
  }
`;

// Invite service functions
export const inviteService = {
  async getInvite(token) {
    try {
      const data = await graphqlClient.request(GET_INVITE_QUERY, { token });
      return data.getInvite;
    } catch (error) {
      throw new Error(error.message || 'Failed to get invite');
    }
  },

  async getStoreInvites(storeId) {
    try {
      const data = await graphqlClient.request(GET_STORE_INVITES_QUERY, { storeId });
      return data.getStoreInvites || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to get store invites');
    }
  },

  async createInvite(inviteData) {
    try {
      const data = await graphqlClient.request(CREATE_INVITE_MUTATION, { input: inviteData });
      return data.createInvite;
    } catch (error) {
      throw new Error(error.message || 'Failed to create invite');
    }
  },

  async acceptInvite(token) {
    try {
      const data = await graphqlClient.request(ACCEPT_INVITE_MUTATION, { token });
      return data.acceptInvite;
    } catch (error) {
      throw new Error(error.message || 'Failed to accept invite');
    }
  },

  async revokeInvite(id) {
    try {
      const data = await graphqlClient.request(REVOKE_INVITE_MUTATION, { id });
      return data.revokeInvite;
    } catch (error) {
      throw new Error(error.message || 'Failed to revoke invite');
    }
  },

  async removeTeamMember(storeId, userId) {
    try {
      const data = await graphqlClient.request(REMOVE_TEAM_MEMBER_MUTATION, { storeId, userId });
      return data.removeTeamMember;
    } catch (error) {
      throw new Error(error.message || 'Failed to remove team member');
    }
  },
};

// Payout service functions
export const payoutService = {
  async getStoreBankAccount(storeId) {
    try {
      const data = await graphqlClient.request(GET_STORE_BANK_ACCOUNT_QUERY, { storeId });
      return data.getStoreBankAccount;
    } catch (error) {
      throw new Error(error.message || 'Failed to get bank account');
    }
  },

  async getStoreTransactions(storeId) {
    try {
      const data = await graphqlClient.request(GET_STORE_TRANSACTIONS_QUERY, { storeId });
      return data.getStoreTransactions || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to get transactions');
    }
  },

  async updateBankAccount(storeId, bankAccountData) {
    try {
      const data = await graphqlClient.request(UPDATE_BANK_ACCOUNT_MUTATION, { 
        storeId, 
        input: bankAccountData 
      });
      return data.updateBankAccount;
    } catch (error) {
      throw new Error(error.message || 'Failed to update bank account');
    }
  },

  async createTransaction(transactionData) {
    try {
      const data = await graphqlClient.request(CREATE_TRANSACTION_MUTATION, { 
        input: transactionData 
      });
      return data.createTransaction;
    } catch (error) {
      throw new Error(error.message || 'Failed to create transaction');
    }
  },
}; 