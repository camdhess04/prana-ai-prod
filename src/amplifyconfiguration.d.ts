declare const amplifyConfig: {
  Auth: {
    Cognito: {
      userPoolClientId: string;
      userPoolId: string;
      identityPoolId: string;
      region: string;
    };
  };
};

export default amplifyConfig; 