import React from 'react';

const composeProviders = (providers) => {
  return ({ children }) =>
    providers.reduceRight((acc, provider) => {
      if (Array.isArray(provider)) {
        const [Provider, props] = provider;
        return <Provider {...props}>{acc}</Provider>;
      }

      const Provider = provider;
      return <Provider>{acc}</Provider>;
    }, children);
};

export default composeProviders;
