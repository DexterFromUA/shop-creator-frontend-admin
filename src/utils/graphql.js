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
      role
      paymentCardNumber
      paymentCardHolder
      paymentCardExpiryMonth
      paymentCardExpiryYear
      paymentCardCvv
      stores {
        storeId
        permissions
      }
    }
  }
`;

export const MY_STORES_QUERY = `
  query MyStores {
    myStores {
      storeId
      clientId
      store {
        id
        name
        description
        isActive
        createdAt
        contactCity
      }
      client {
        id
      }
      permissions
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
          storeId
          clientId
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
          storeId
          clientId
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
      subscriptionActive
      subscriptionType
      subscriptionStartDate
      subscriptionEndDate
      updatedAt
    }
  }
`;

export const GET_STORE_QUERY = `
  query GetStore($storeId: ID!) {
    store(id: $storeId) {
      storeId
      clientId
      permissions
      store {
        id
        name
        description
        contactEmail
        contactPhone
        contactAddress
        contactCity
        appId
        isActive
        bankAccountNumber
        bankAccountHolder
        bankName
        bankIban
        bankSwiftCode
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_PAYMENT_CARD_MUTATION = `
  mutation UpdatePaymentCard($input: UpdatePaymentCardInput!) {
    updatePaymentCard(input: $input) {
      id
      paymentCardNumber
      paymentCardHolder
      paymentCardExpiryMonth
      paymentCardExpiryYear
      paymentCardCvv
    }
  }
`;

export const REMOVE_PAYMENT_CARD_MUTATION = `
  mutation RemovePaymentCard {
    removePaymentCard {
      id
      paymentCardNumber
      paymentCardHolder
      paymentCardExpiryMonth
      paymentCardExpiryYear
      paymentCardCvv
      updatedAt
    }
  }
`;

// Payout Queries
export const GET_STORE_BANK_ACCOUNT_QUERY = `
  query GetStoreBankAccount($storeId: String!) {
    getStoreBankAccount(storeId: $storeId) {
      id
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
        input: { subscriptionType },
      });
      return data.updateSubscription;
    } catch (error) {
      throw new Error(error.message || 'Failed to update subscription');
    }
  },

  async updatePaymentCard(cardData) {
    try {
      const data = await graphqlClient.request(UPDATE_PAYMENT_CARD_MUTATION, {
        input: cardData,
      });
      console.log(data);
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

  async updateStore(id, storeData) {
    try {
      const data = await graphqlClient.request(UPDATE_STORE_MUTATION, { id, input: storeData });
      return data.updateStore;
    } catch (error) {
      throw new Error(error.message || 'Failed to update store');
    }
  },
};

// Product queries and mutations
export const GET_STORE_PRODUCTS_QUERY = `
  query GetStoreProducts($storeId: ID!) {
    storeProducts(storeId: $storeId) {
      id
      name
      category
      amount
      priceRange {
        min
        max
      }
      discountRange {
        min
        max
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
      category
      amount
      imgUrls
      orderCount
      isActive
      productOptions {
        id
        name
        description
        price
        isPreOrder
        isDiscount
        discountPercent
        isLimited
        quantity
        createdAt
        updatedAt
      }
      storeId
      priceRange {
        min
        max
      }
      discountRange {
        min
        max
      }
      shortLinks {
        id
        code
        description
        clicks
        expirationDate
        createdAt
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
      category
      amount
      imgUrls
      orderCount
      isActive
      store {
        id
        name
      }
      productOptions {
        id
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
      category
      amount
      imgUrls
      orderCount
      productOptions {
        id
        name
        description
        price
        isPreOrder
        isDiscount
        discountPercent
        isLimited
        quantity
        createdAt
        updatedAt
      }
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPLOAD_FILES_MUTATION = `
  mutation UploadFiles($storeId: ID!, $fileNames: [String!]!, $fileTypes: [String!]!) {
    uploadFiles(storeId: $storeId, fileNames: $fileNames, fileTypes: $fileTypes) {
      uploadUrl
      fileKey
    }
  }
`;

export const REVOKE_LINK_MUTATION = `
  mutation RevokeShortLink($id: String!, $productId: String!, $storeId: String!) {
    revokeShortLink(id: $id, productId: $productId, storeId: $storeId)
  }
`;

export const SHORT_LINK_QUERY = `
  query GetShortLink($code: String!) {
    getShortLink(code: $code) {
      id
      code
      description
      clicks
      expirationDate
      productId
      product {
        id
        name
        category
        description
        productOptions {
          id
          name
          description
          price
          isPreOrder
          isDiscount
          discountPercent
          quantity
          isLimited
          updatedAt
        }
        imgUrls
        storeId
        isActive
        updatedAt
      }
      createdAt
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
      const data = await graphqlClient.request(UPDATE_PRODUCT_STOCK_MUTATION, {
        id,
        sizeInventory,
      });
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

  async uploadFiles(storeId, fileNames, fileTypes) {
    try {
      const data = await graphqlClient.request(UPLOAD_FILES_MUTATION, {
        storeId,
        fileNames,
        fileTypes,
      });
      return data.uploadFiles;
    } catch (error) {
      throw new Error(error.message || 'Failed to upload files');
    }
  },

  async createShortLink(productId, description, expirationDate) {
    try {
      const data = await graphqlClient.request(CREATE_SHORT_LINK_MUTATION, {
        productId,
        description,
        expirationDate,
      });
      return data.createShortLink;
    } catch (error) {
      throw new Error(error.message || 'Failed to create short link');
    }
  },

  async revokeShortLink(id, productId, storeId) {
    try {
      const data = await graphqlClient.request(REVOKE_LINK_MUTATION, { id, productId, storeId });
      return data.revokeShortLink;
    } catch (error) {
      throw new Error(error.message || 'Failed revoke link');
    }
  },

  async getShortLink(code) {
    try {
      const data = await graphqlClient.request(SHORT_LINK_QUERY, { code });
      return data.getShortLink;
    } catch (error) {
      throw new Error(error.message || 'Failed load short link');
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
export const GET_STORE_USERS_QUERY = `
  query GetStoreUsers($storeId: String!) {
    getStoreUsers(storeId: $storeId) {
      id
      name
      email
      usedInvites {
        id
        permissions
      }
    }
  }
`;

export const GET_INVITE_QUERY = `
  query GetInvite($token: String!) {
    getInvite(token: $token) {
      id
      token
      email
      description
      permissions
      expiresAt
      store {
        id
        name
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
      description
      permissions
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
      description
      permissions
      createdAt
      expiresAt
    }
  }
`;

export const ACCEPT_INVITE_MUTATION = `
  mutation AcceptInvite($token: String!) {
    acceptInvite(token: $token) {
      storeId
      clientId
      permissions
      expiresAt
      store {
        name
      }
    }
  }
`;

export const REVOKE_INVITE_MUTATION = `
  mutation RevokeInvite($id: String!) {
    revokeInvite(id: $id) {
      id
      token
      email
      description
      permissions
      isUsed
      usedAt
    }
  }
`;

export const REMOVE_TEAM_MEMBER_MUTATION = `
  mutation RemoveTeamMember($storeId: String!, $userId: String!) {
    removeTeamMember(storeId: $storeId, userId: $userId) {
      storeId
      clientId
    }
  }
`;

// Invite service functions
export const inviteService = {
  async getStoreUsers(storeId) {
    try {
      const data = await graphqlClient.request(GET_STORE_USERS_QUERY, { storeId });
      return data.getStoreUsers || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to get users');
    }
  },

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
      console.log('CLIENT DATA', data);
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
        input: bankAccountData,
      });
      return data.updateBankAccount;
    } catch (error) {
      throw new Error(error.message || 'Failed to update bank account');
    }
  },

  async createTransaction(transactionData) {
    try {
      const data = await graphqlClient.request(CREATE_TRANSACTION_MUTATION, {
        input: transactionData,
      });
      return data.createTransaction;
    } catch (error) {
      throw new Error(error.message || 'Failed to create transaction');
    }
  },
};

export const UPDATE_STORE_MUTATION = `
  mutation UpdateStore($id: ID!, $input: UpdateStoreInput!) {
    updateStore(id: $id, input: $input) {
      id
      name
      description
      contactEmail
      contactPhone
      contactAddress
      contactCity
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SHORT_LINK_MUTATION = `
  mutation CreateShortLink($productId: String!, $description: String, $expirationDate: String) {
    createShortLink(productId: $productId, description: $description, expirationDate: $expirationDate) {
      id
      code
      description
      clicks
      expirationDate
      productId
      createdAt
    }
  }
`;
