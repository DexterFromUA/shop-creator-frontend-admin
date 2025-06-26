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
        createdAt
        updatedAt
      }
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
}; 